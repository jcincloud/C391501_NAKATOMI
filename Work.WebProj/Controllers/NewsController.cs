using ProcCore.Business.DB0;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.WebApp.Controllers
{
    public class NewsController : WebUserController
    {
        // GET: News
        public ActionResult Index()
        {

            IEnumerable<m_News> items;
            using (db0 = getDB0())
            {
                items = (from x in db0.News
                         orderby x.sort descending
                         where x.i_Hide == false && x.i_Lang == System.Globalization.CultureInfo.CurrentCulture.Name
                         select new m_News()
                         {
                             news_id = x.news_id,
                             title = x.title,
                             start_day = x.start_day,
                             end_day=x.end_day,
                             is_interval=x.is_interval,
                             introduction = x.introduction
                         }).ToList();
                foreach (var i in items)
                {
                    i.introduction = RemoveHTMLTag(i.introduction);
                }
            }

            return View("News_list", items);
        }
        public ActionResult News_Content(int id)
        {
            News item;
            using (db0 = getDB0())
            {
                Boolean Exist = db0.News.Any(x => x.news_id == id && x.i_Hide == false && x.i_Lang == System.Globalization.CultureInfo.CurrentCulture.Name);
                if (!Exist)
                {
                    return Redirect("~/News");
                }
                item = db0.News.Single(x => x.news_id == id);
            }
            return View(item);
        }
    }
}