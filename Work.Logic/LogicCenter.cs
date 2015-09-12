using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.NetExtension;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace ProcCore.Business
{
    public enum CodeTable
    {
        Base, News, Banner
    }
    public enum SNType
    {
        Orders, Product, Receiver, Import, Stock, Export, StockAdj
    }
}
namespace ProcCore.Business.LogicConect
{
    #region Code Define Section
    public static class CodeSheet
    {
        public static fuel_category fuel_category = new fuel_category()
        {
            gas = new i_Code() { Code = "gas", Value = "氣體", LangCode = "C_fuel_category_gas" },
            liquid = new i_Code() { Code = "liquid", Value = "液體", LangCode = "C_fuel_category_liquid" },
            solid = new i_Code() { Code = "solid", Value = "固體", LangCode = "C_fuel_category_solid" }
        };

    }
    public class fuel_category : BaseSheet
    {
        public i_Code gas { get; set; }
        public i_Code liquid { get; set; }
        public i_Code solid { get; set; }
        public override List<i_Code> MakeCodes()
        {
            this.Codes = new List<i_Code>();
            this.Codes.AddRange(new i_Code[] { 
                this.gas, this.liquid,this.solid }
                );
            return base.MakeCodes();
        }
    }

    #endregion

    #region Parm Section
    public enum ParmDefine
    {
        Open, ValidDate, Apply_Max_Day, bufferNorth_Max, bufferSouth_Max, N_Max_joinnum, S_Max_joinnum, receiveMails, BccMails
    }
    #endregion

    public class LogicCenter
    {
        private static string db0_connectionstring;
        protected C39A0_NAKATOMIEntities db0;
        protected TransactionScope tx;
        private const string DatabaseName = "C39A0_NAKATOMI";
        public int DepartmentId { get; set; }
        public string Lang { get; set; }
        public string IP { get; set; }
        public string AspUserID { get; set; }
        public static string GetDB0EntityString(string configstring)
        {
            string[] DataConnectionInfo = configstring.Split(',');

            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = DataConnectionInfo[0];
            builder.UserID = DataConnectionInfo[1];
            builder.Password = DataConnectionInfo[2];
            builder.InitialCatalog = DatabaseName;
            builder.IntegratedSecurity = false;
            builder.PersistSecurityInfo = false;

            EntityConnectionStringBuilder entBuilder = new EntityConnectionStringBuilder();
            entBuilder.Provider = "System.Data.SqlClient";
            entBuilder.ProviderConnectionString = builder.ConnectionString;
            entBuilder.Metadata = String.Format("res://{0}/{1}.csdl|res://{0}/{1}.ssdl|res://{0}/{1}.msl", "Proc.BusinessLogic", "DB0." + DatabaseName);
            return entBuilder.ConnectionString;
        }
        public static string GetDB0ConnectionString(string configstring)
        {
            string[] DataConnectionInfo = configstring.Split(',');

            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.DataSource = DataConnectionInfo[0];
            builder.UserID = DataConnectionInfo[1];
            builder.Password = DataConnectionInfo[2];
            builder.InitialCatalog = DatabaseName;
            builder.MultipleActiveResultSets = true;
            builder.IntegratedSecurity = false;

            return builder.ConnectionString;
        }
        public LogicCenter() { }
        public LogicCenter(string db0_configstring)
        {
            db0_connectionstring = LogicCenter.GetDB0EntityString(db0_configstring);
        }

        public static C39A0_NAKATOMIEntities getDB0
        {
            get
            {
                return new C39A0_NAKATOMIEntities(db0_connectionstring);
            }
        }
        public int GetNewId(ProcCore.Business.CodeTable tab)
        {
            int i = 0;

            using (var tx = new TransactionScope())
            {
                var get_id_db = getDB0;

                try
                {
                    string tab_name = Enum.GetName(typeof(ProcCore.Business.CodeTable), tab);
                    var item = get_id_db.i_IDX.Where(x => x.table_name == tab_name)
                        .ToList()
                        .FirstOrDefault();

                    if (item != null)
                    {
                        item.IDX++;
                        get_id_db.SaveChanges();
                        tx.Complete();
                        i = item.IDX;
                    }
                }
                catch (Exception ex)
                {
                    Log.Write(ex.ToString());
                }
                finally
                {
                    get_id_db.Dispose();
                }
                return i;
            }
        }
        private snObject GetSN(ProcCore.Business.SNType tab)
        {
            snObject sn = new snObject();

            using (var tx = new TransactionScope())
            {
                var get_sn_db = getDB0;
                try
                {
                    get_sn_db = getDB0;
                    string tab_name = Enum.GetName(typeof(ProcCore.Business.SNType), tab);
                    var items = get_sn_db.i_SN.Single(x => x.sn_type == tab_name);

                    if (items.y == DateTime.Now.Year &&
                        items.m == DateTime.Now.Month &&
                        items.d == DateTime.Now.Day
                        )
                    {
                        int now_max = items.sn_max;
                        now_max++;
                        items.sn_max = now_max;
                    }
                    else
                    {
                        items.y = DateTime.Now.Year;
                        items.m = DateTime.Now.Month;
                        items.d = DateTime.Now.Day;
                        items.sn_max = 1;
                    }

                    get_sn_db.SaveChanges();
                    tx.Complete();

                    sn.y = items.y;
                    sn.m = items.m;
                    sn.d = items.d;
                    sn.sn_max = items.sn_max;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
                finally
                {
                    get_sn_db.Dispose();
                }
            }
            return sn;
        }
        public string getReceiverSN() //
        {
            String tpl = "TY{0}{1:00}{2:00}-{3:00}";
            snObject sn = GetSN(ProcCore.Business.SNType.Receiver);
            return string.Format(tpl, sn.y.ToString().Right(2), sn.m, sn.d, sn.sn_max);
        }
        public object getParmValue(ParmDefine ParmName)
        {
            db0 = getDB0;
            string getName = Enum.GetName(typeof(ParmDefine), ParmName);
            var item = db0.i_Parm.Where(x => x.ParmName == getName).FirstOrDefault();
            if (item != null)
            {
                if (item.ParmType == "S")
                {
                    return item.S;
                }
                if (item.ParmType == "I")
                {
                    return item.I;
                }
                if (item.ParmType == "F")
                {
                    return item.F;
                }
                if (item.ParmType == "D")
                {
                    return item.D;
                }
                if (item.ParmType == "B")
                {
                    return item.B;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        public void setParmValue(ParmDefine ParmName, object value)
        {
            db0 = getDB0;
            var item = db0.i_Parm.Where(x => x.ParmName == Enum.GetName(typeof(ParmDefine), ParmName)).FirstOrDefault();
            if (item != null)
            {
                if (item.ParmType == "S")
                {
                    item.S = (string)value;
                }
                if (item.ParmType == "I")
                {
                    item.I = (int)value;
                }
                if (item.ParmType == "F")
                {
                    item.F = (decimal)value;
                }
                if (item.ParmType == "D")
                {
                    item.D = (DateTime)value;
                }
                if (item.ParmType == "B")
                {
                    item.B = (bool)value;
                }
            }
            db0.SaveChanges();
        }
        public static void SetDB0EntityString(string configstring)
        {
            db0_connectionstring = GetDB0EntityString(configstring);
        }
    }
    public class ReportCenter : LogicCenter
    {
        public ReportCenter() : base() { }
        public ReportCenter(string config_string)
            : base(config_string)
        {
            this.db0 = getDB0;
        }

    }
}