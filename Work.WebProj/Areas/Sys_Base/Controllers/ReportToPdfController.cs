using DotWeb.Helpers;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Reporting.WebForms;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace DotWeb.Areas.Sys_Base.Controllers
{
    public class ReportToPdfController : AdminController
    {
        private byte[] ToPdfReport(ReportData rpt, List<ReportParameter> param)
        {
            Warning[] warnings;
            string[] streamIds;
            string mimeType = string.Empty;
            string encoding = string.Empty;
            string extension = string.Empty;

            ReportViewer rptvw = new ReportViewer();
            rptvw.ProcessingMode = ProcessingMode.Local;
            ReportDataSource rds = new ReportDataSource("ReportDataSet", rpt.Data);

            rptvw.LocalReport.DataSources.Clear();
            rptvw.LocalReport.ReportPath = @"_Code\RPTFile\" + rpt.ReportName;
            rptvw.LocalReport.DataSources.Add(rds);
            foreach (var pa in param)
            {
                rptvw.LocalReport.SetParameters(pa);
            }
            rptvw.LocalReport.Refresh();

            byte[] bytes = rptvw.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            return bytes;
        }
        #region 會員列印(未使用)
        //public FileResult MemberLabel()
        //{
        //    ReportCenter logicCenter = new ReportCenter(CommSetup.CommWebSetup.DB0_CodeString);
        //    ReportViewer rptvw = new ReportViewer();
        //    rptvw.ProcessingMode = ProcessingMode.Local;
        //    ReportDataSource rds = new ReportDataSource("MasterData", logicCenter.memberLabel());

        //    rptvw.LocalReport.DataSources.Clear();
        //    rptvw.LocalReport.ReportPath = @"_Code\RPTFile\MemeberLabel.rdlc";
        //    rptvw.LocalReport.DataSources.Add(rds);
        //    //foreach (var pa in param)
        //    //{
        //    //    rptvw.LocalReport.SetParameters(pa);
        //    //}
        //    rptvw.LocalReport.Refresh();

        //    Warning[] warnings;
        //    string[] streamIds;
        //    string mimeType = string.Empty;
        //    string encoding = string.Empty;
        //    string extension = string.Empty;
        //    byte[] bytes = rptvw.LocalReport.Render("PDF", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
        //    Stream outputStream = new MemoryStream(bytes);
        //    string setFileName = "LabelPrint-" + DateTime.Now.Ticks + ".pdf";
        //    return File(outputStream, "application/pdf", setFileName);
        //}
        #endregion
    }
}