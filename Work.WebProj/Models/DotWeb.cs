using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace DotWeb
{
    public class StringResult : ViewResult
    {
        public String ToHtmlString { get; set; }
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (string.IsNullOrEmpty(this.ViewName))
            {
                this.ViewName = context.RouteData.GetRequiredString("action");
            }

            ViewEngineResult result = null;

            if (this.View == null)
            {
                result = this.FindView(context);
                this.View = result.View;
            }

            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);

            ViewContext viewContext = new ViewContext(context, this.View, this.ViewData, this.TempData, writer);

            this.View.Render(viewContext, writer);

            writer.Flush();

            ToHtmlString = Encoding.UTF8.GetString(stream.ToArray());

            if (result != null)
                result.ViewEngine.ReleaseView(context, this.View);
        }
    }
    public class BaseRptInfo
    {
        public int UserId { get; set; }
        public String UserName { get; set; }
        public String MakeDate
        {
            get
            {
                return DateTime.Now.ToString("yyyy/MM/dd");
            }
        }
        public String Title { get; set; }
    }
    public class CReportInfo
    {
        public CReportInfo()
        {
            SubReportDataSource = new List<SubReportData>();
        }
        public static String ReportCompany = "";
        public String ReportFile { get; set; }
        public DataTable ReportData { get; set; }
        public List<SubReportData> SubReportDataSource { get; set; }

        public DataSet ReportMDData { get; set; }
        public Dictionary<String, Object> ReportParm { get; set; }
    }
    public class SubReportData
    {
        public string SubReportName { get; set; }
        public DataTable DataSource { get; set; }
    }
}
