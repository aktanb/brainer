using Brainer.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebMatrix.WebData;

namespace Brainer.Controllers
{
    public class PageController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public PartialViewResult Main()
        {
            return PartialView();
        }

        [HttpPost]
        public PartialViewResult Play()
        {
            return PartialView();
        }

        [HttpPost]
        public PartialViewResult Scores()
        {
            return PartialView();
        }

        [HttpPost]
        public PartialViewResult Read()
        {
            return PartialView();
        }

        [HttpPost]
        public PartialViewResult About()
        {
            return PartialView();
        }
    }
}
