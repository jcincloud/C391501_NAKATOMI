using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DotWeb.WebApp.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View("Products_list");
        }
        public ActionResult Products_list2()
        {
            return View();
        }
        public ActionResult Products_list3()
        {
            return View();
        }
        public ActionResult Products_SAC6500()
        {
            return View();
        }
        public ActionResult Products_SAC4500()
        {
            return View();
        }
        public ActionResult Products_SAC1800()
        {
            return View();
        }
        public ActionResult Products_N407TC()
        {
            return View();
        }
        public ActionResult Products_N410TC()
        {
            return View();
        }
        public ActionResult map()
        {
            return View();
        }
    }
}