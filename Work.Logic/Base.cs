using System;
using System.Collections.Generic;
using System.Data.Entity;

namespace ProcCore.Business
{
    public abstract class QueryBase
    {
        public QueryBase()
        {
        }

        public int? page { get; set; }
    }
    public class snObject
    {
        public int y { get; set; }
        public int m { get; set; }
        public int d { get; set; }
        public int w { get; set; }
        public int sn_max { get; set; }
    }
    public abstract class BaseEntityTable
    {
        public Int16 edit_type { get; set; }
        public bool check_del { get; set; }
    }
}
namespace ProcCore.Business.LogicConect
{
    #region Code Sheet
    public class BaseSheet
    {
        //public string HeadCode { get; set; }
        protected List<i_Code> Codes { get; set; }
        public virtual List<i_Code> MakeCodes()
        {
            return this.Codes;
        }
        public Dictionary<string, string> ToDictionary()
        {
            Dictionary<string, string> d = new Dictionary<string, string>();
            foreach (i_Code _C in this.MakeCodes())
            {
                d.Add(_C.Code, _C.Value);
            }
            return d;
        }
    }
    public class i_Code
    {
        public string Code { get; set; }
        public string LangCode { get; set; }
        public string Value { get; set; }
    }
    #endregion
    #region Currency
    public class CUYUnit
    {
        public string sign { get; set; }
        public string code { get; set; }
    }
    public static class CUY
    {
        public static CUYUnit Taiwan = new CUYUnit() { sign = "NT$", code = "NTD" };
        public static CUYUnit American = new CUYUnit() { sign = "$", code = "USD" };
        public static CUYUnit China = new CUYUnit() { sign = "¥", code = "CNY" };
        public static CUYUnit Euro = new CUYUnit() { sign = "€", code = "EUR" };
        public static CUYUnit Japanese = new CUYUnit() { sign = "￥", code = "JPY" };
        public static CUYUnit HongKong = new CUYUnit() { sign = "HK$", code = "HKD" };
        public static CUYUnit Korean = new CUYUnit() { sign = "₩", code = "KRW" };
        public static CUYUnit Philippine = new CUYUnit() { sign = "₱", code = "PHP" };
        public static CUYUnit[] CUYS = new CUYUnit[] { 
            CUY.Taiwan, 
            CUY.American, 
            CUY.China, 
            CUY.Euro, 
            CUY.Japanese, 
            CUY.HongKong, 
            CUY.Korean ,
            CUY.Philippine
        };
    }
    #endregion
}