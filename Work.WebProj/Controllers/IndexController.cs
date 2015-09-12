using System.Web.Mvc;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            WebInfo info = new WebInfo();
            ViewBag.IsFirstPage = true;

            using (db0 = getDB0())
            {
                info.News = db0.News.Where(x => x.i_Hide == false && x.i_Lang == System.Globalization.CultureInfo.CurrentCulture.Name).OrderByDescending(x => x.sort).Take(3).ToList();
                info.Banner = db0.Banner.Where(x => x.i_Hide == false & x.i_Lang == System.Globalization.CultureInfo.CurrentCulture.Name & x.type == (int)BannerType.index).OrderByDescending(x => x.sort).ToList();
                foreach (var item in info.Banner)
                {
                    item.imgsrc = GetImg(item.banner_id, "Banner", "Banner", "Banner");//顯示列表圖
                }

                return View(info);
            };
        }
    }


}
