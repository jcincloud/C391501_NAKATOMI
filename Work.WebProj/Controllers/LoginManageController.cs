
using System.Web.Mvc;


namespace DotWeb.Controllers
{
    public class LoginManageController : Controller
    {
        public RedirectResult Index()
        {
            //Response.Cookies.Add(new System.Web.HttpCookie("userid", "E0001"));
            return Redirect("~/Sys_Base/MNGLogin");
        }
    }
}
