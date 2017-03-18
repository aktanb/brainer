using System.Web;
using System.Web.Optimization;

namespace Brainer
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region Styles
            bundles.Add
            (
                new StyleBundle("~/bundles/Styles").Include
                (
                    "~/Content/Main.css",
                    "~/Content/Loading.css",
                    "~/Content/jqPlot.changes.css"
                )
            );

            bundles.Add
            (
                new StyleBundle("~/bundles/ComponentStyles").Include
                (
                    "~/Content/themes/base/jquery.ui.core.css",
                    "~/Content/themes/base/jquery.ui.resizable.css",
                    "~/Components/Foundation/css/foundation.css"
                )
            );

            bundles.Add
            (
                new StyleBundle("~/bundles/Playground").Include
                (
                    "~/Playground/css/css.css"
                )
            );
            #endregion

            #region Scripts
            bundles.Add
            (
                new ScriptBundle("~/bundles/Scripts").Include
                (
                    "~/Scripts/Brainer/Marginal.Utilities.js",
                    "~/Scripts/Brainer/Marginal.Revealed.js",
                    "~/Scripts/Brainer/Marginal.Spinner.js",
                    "~/Scripts/Brainer/Marginal.Sound.js",
                    "~/Scripts/Brainer/Marginal.Strings.js",
                    "~/Scripts/Brainer/Brainer.Site.js",
                    "~/Scripts/Brainer/Brainer.Session.js",
                    "~/Scripts/Brainer/Brainer.Sounds.js",
                    "~/Scripts/Brainer/Brainer.Navigation.js",
                    "~/Scripts/Brainer/Brainer.Playground.js",
                    "~/Scripts/Brainer/Brainer.Game.js",
                    "~/Scripts/Brainer/Brainer.MainGame.js",
                    "~/Scripts/Brainer/Brainer.InnerGame.js",
                    "~/Scripts/Brainer/Views/Play.js"
                )
            );

            bundles.Add
            (
                new ScriptBundle("~/bundles/Reveal").Include
                (
                    "~/Components/Reveal/lib/js/head.js",
                    "~/Components/Reveal/js/reveal.js"
                )
            );

            bundles.Add
            (
                new ScriptBundle("~/bundles/Foundation").Include
                (
                    "~/Components/Foundation/js/vendor/modernizr.js",
                    "~/Components/Foundation/js/foundation.js",
                    "~/Components/Foundation/js/foundation/foundation.dropdown.js"
                )
            );

            bundles.Add
            (
                new ScriptBundle("~/bundles/Miscellaneous").Include
                (
                    "~/Components/uuid.core.js",
                    "~/Components/jquery.transit.min.js",
                    "~/Components/jquery.flexverticalcenter.js",
                    "~/Components/jquery.guid.js",
                    "~/Components/jquery.swfobject.min.js"
                )
            );
            #endregion
        }
    }
}