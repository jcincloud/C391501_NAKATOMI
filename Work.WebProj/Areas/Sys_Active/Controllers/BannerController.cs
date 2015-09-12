using DotWeb.CommSetup;
using DotWeb.WebApp;
using ProcCore.Business;
using ProcCore.HandleResult;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DotWeb.Areas.Sys_Active.Controllers
{
    public class BannerController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult index()
        {
            ActionRun();
            return View();
        }

        #endregion

        #region ajax call section

        public string aj_Init()
        {
            using (var db0 = getDB0())
            {
                return defJSON(new
                {
                    // options_equipment_category = db0.Equipment_Category.OrderBy(x=>x.sort)
                });
            }
        }
        #endregion

        #region ajax file section
        [HttpPost]
        public string axFUpload(int id, string filekind, string filename, bool check_add, string word)
        {
            UpFileInfo r = new UpFileInfo();
            #region
            try
            {
                //banner 圖片
                if (filekind == "Banner")
                {
                    handleImageSave(filename, id, ImageFileUpParm.BannerIndex, filekind, "Banner", "Banner");

                    if (check_add)
                    {
                        string upload_path_tpl = "~/_Upload/{0}/{1}/{2}/{3}/{4}";
                        string upload_path_tpl_icon = "~/_Upload/{0}/{1}/{2}/{3}/{4}/{5}";
                        string web_path_parm = string.Format(upload_path_tpl, "Banner", "Banner", id, filekind, filename);
                        string web_path_parm_icon = string.Format(upload_path_tpl_icon, "Banner", "Banner", id, filekind, "icon", filename);
                        AddTextToImg(web_path_parm, word);
                        AddTextToImg(web_path_parm_icon, word);
                    }
                }
                //banner 圖片
                if (filekind == "Photo")
                    handleImageSave(filename, id, ImageFileUpParm.BannerClient, filekind, "Banner", "Banner");

                r.result = true;
                r.file_name = filename;
            }
            catch (LogicError ex)
            {
                r.result = false;
                r.message = getRecMessage(ex.Message);
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            #endregion
            return defJSON(r);
        }

        [HttpPost]
        public string axFList(int id, string filekind)
        {
            SerializeFileList r = new SerializeFileList();

            if (filekind == "Banner")
                r.files = listImgFiles(id, filekind, "Banner", "Banner");
            if (filekind == "Photo")
                r.files = listImgFiles(id, filekind, "Banner", "Banner");

            r.result = true;
            return defJSON(r);
        }

        [HttpPost]
        public string axFDelete(int id, string filekind, string filename)
        {
            ResultInfo r = new ResultInfo();

            if (filekind == "Banner")
                DeleteSysFile(id, filekind, filename, ImageFileUpParm.BannerIndex, "Banner", "Banner");
            if (filekind == "Photo")
                DeleteSysFile(id, filekind, filename, ImageFileUpParm.BannerClient, "Banner", "Banner");

            r.result = true;
            return defJSON(r);
        }

        [HttpPost]
        public string axFSort(int id, string filekind, IList<JsonFileInfo> file_object)
        {
            ResultInfo r = new ResultInfo();
            if (filekind == "Banner")
                rewriteJsonFile(id, filekind, "Banner", "Banner", file_object);
            if (filekind == "Photo")
                rewriteJsonFile(id, filekind, "Banner", "Banner", file_object);

            r.result = true;
            return defJSON(r);
        }

        #endregion

    }
}