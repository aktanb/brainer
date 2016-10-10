using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace Brainer.Controllers
{
    public class HomeController : Controller
    {
        public String CurrentCulture
        {
            get
            {
                if (Session["CurrentCulture"] == null)
                {
                    return Constants.Culture.ru_RU;
                }

                return Session["CurrentCulture"].ToString();
            }
            set
            {
                Session["CurrentCulture"] = value;
            }
        }

        public ActionResult Index(String returnUrl, String culture = null)
        {
            ViewBag.ReturnUrl = returnUrl;

            ViewBag.CurrentCulture = CurrentCulture;

            return View();
        }

        [HttpPost]
        public void ChangeCulture(String culture)
        {
            CurrentCulture = culture;
        }

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            var cultureInfo = CultureInfo.GetCultureInfo(CurrentCulture);

            Thread.CurrentThread.CurrentCulture = cultureInfo;

            Thread.CurrentThread.CurrentUICulture = cultureInfo;
        }
    }
}