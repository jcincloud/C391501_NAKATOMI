using DotWeb.CommSetup;
using DotWeb.WebApp;
using ProcCore.Business;
using ProcCore.HandleResult;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.Areas.Sys_Active.Controllers
{
    public class ActiveContentController : BaseController
    {
        #region ajax file section
        [HttpPost]
        public string aj_FUpload(int id, string filekind, string fileName)
        {
            ReturnAjaxFiles rAjaxResult = new ReturnAjaxFiles();
            #region
            string tpl_File = string.Empty;
            try
            {
                //代表圖片
                if (filekind == "Photo1")
                    HandImageSave(fileName, id, ImageFileUpParm.NewsBasicSingle, filekind, "Activities", "ActivitiesDetail");
                //多張圖片
                if (filekind == "DoubleImg")
                    HandImageSave(fileName, id, ImageFileUpParm.NewsBasicDouble, filekind);

                rAjaxResult.result = true;
                rAjaxResult.success = true;
                rAjaxResult.FileName = fileName;
            }
            catch (LogicError ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.success = false;
                rAjaxResult.error = getRecMessage(ex.Message);
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.success = false;
                rAjaxResult.error = ex.Message;
            }
            #endregion
            return defJSON(rAjaxResult);
        }

        [HttpPost]
        public string aj_FList(int id, string filekind)
        {
            ReturnAjaxFiles rAjaxResult = new ReturnAjaxFiles();

            rAjaxResult.filesObject = ListSysFiles(id, filekind, true, "Activities", "ActivitiesDetail");
            rAjaxResult.result = true;
            return defJSON(rAjaxResult);
        }

        [HttpPost]
        public string aj_FDelete(int id, string filekind, string filename)
        {
            ReturnAjaxFiles rAjaxResult = new ReturnAjaxFiles();
            DeleteSysFile(id, filekind, filename, ImageFileUpParm.NewsBasicSingle, "Activities", "ActivitiesDetail");
            rAjaxResult.result = true;
            return defJSON(rAjaxResult);
        }
        #endregion
    }
}