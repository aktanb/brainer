using System.Web;
using System.Web.Optimization;

namespace Brainer
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region MVC
            bundles.Add
            (
                new ScriptBundle("~/bundles/jquery").Include
                (
                    "~/Scripts/jquery-{version}.js"
                )
            );

            bundles.Add
            (
                new ScriptBundle("~/bundles/jqueryui").Include
                (
                    "~/Scripts/jquery-ui-{version}.js"
                )
            );

            bundles.Add
            (
                new ScriptBundle("~/bundles/jqueryval").Include
                (
                    "~/Scripts/jquery.unobtrusive*",
                    "~/Scripts/jquery.validate*"
                )
            );

            bundles.Add
            (
                new ScriptBundle("~/bundles/knockout").Include
                (
                    "~/Scripts/knockout-{version}.js"
                )
            );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add
            (
                new ScriptBundle("~/bundles/modernizr").Include
                (
                    "~/Scripts/modernizr-*"
                )
            );

            bundles.Add
            (
                new StyleBundle("~/Content/css").Include
                (
                    "~/Content/Main.css",
                    "~/Content/Loading.css"
                )
            );

            bundles.Add
            (
                new StyleBundle("~/Content/themes/base/css").Include
                (
                    "~/Content/themes/base/jquery.ui.core.css",
                    "~/Content/themes/base/jquery.ui.resizable.css",
                    "~/Content/themes/base/jquery.ui.selectable.css",
                    "~/Content/themes/base/jquery.ui.accordion.css",
                    "~/Content/themes/base/jquery.ui.autocomplete.css",
                    "~/Content/themes/base/jquery.ui.button.css",
                    "~/Content/themes/base/jquery.ui.dialog.css",
                    "~/Content/themes/base/jquery.ui.slider.css",
                    "~/Content/themes/base/jquery.ui.tabs.css",
                    "~/Content/themes/base/jquery.ui.datepicker.css",
                    "~/Content/themes/base/jquery.ui.progressbar.css",
                    "~/Content/themes/base/jquery.ui.theme.css"
                )
            );
            #endregion

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
            #endregion

            #region Playground
            bundles.Add
            (
                new StyleBundle("~/bundles/Playground").Include
                (
                    "~/Playground/css/css.css"
                )
            );
            #endregion

            #region Components

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

            bundles.Add
            (
                new StyleBundle("~/bundles/ComponentStyles").Include
                (
                    "~/Content/themes/base/jquery.ui.core.css",
                    "~/Content/themes/base/jquery.ui.resizable.css",
                    "~/Components/Foundation/css/foundation.css",
                    "~/Components/Foundation/js/vendor/modernizr.js"
                )
            );
            #endregion
        }
    }
}