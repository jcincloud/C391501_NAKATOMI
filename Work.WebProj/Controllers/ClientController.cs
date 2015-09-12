using ProcCore.Business.DB0;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.WebApp.Controllers
{
    public class ClientController : WebUserController
    {
        // GET: Client
        public ActionResult Index()
        {
            BannerInfo info = new BannerInfo();

            using (db0 = getDB0())
            {
                var all_Banner = db0.Banner.Where(x => x.i_Hide == false && x.i_Lang == System.Globalization.CultureInfo.CurrentCulture.Name & x.type == (int)BannerType.client).OrderByDescending(x => x.sort).ToList();
                foreach (var item in all_Banner)
                {
                    item.imgsrc = GetImg(item.banner_id, "Photo", "Banner", "Banner");//顯示列表圖
                }

                info.photo = all_Banner.Where(x => x.category == (int)BannerCategory.Photo).ToList();
                info.video = all_Banner.Where(x => x.category == (int)BannerCategory.Video).ToList();

                return View("Client", info);
            };
        }
    }
}