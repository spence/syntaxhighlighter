hs.highlight('using System;\n' +
    'using System.Web;\n' +
    'using System.Web.Security;\n' +
    'using Pmi.EnterpriseFramework.Web;\n' +
    'using System.Web.UI.HtmlControls;\n' +
    '\n' +
    'namespace Pmi.WebApplication.MyPmi\n' +
    '{\n' +
    '    public partial class MyPmi : System.Web.UI.MasterPage\n' +
    '    {\n' +
    '        public string PageTitle { get; set; }\n' +
    '\n' +
    '        public void SetSubNavigationPage(string pageName)\n' +
    '        {\n' +
    '            HtmlGenericControl subNavLink = this.FindControl(pageName + "_Link") as HtmlGenericControl;\n' +
    '            if (subNavLink != null)\n' +
    '            {\n' +
    '                subNavLink.Attributes.Add("class", "selected");\n' +
    '            }\n' +
    '        }\n' +
    '\n' +
    '        #region Logon Section\n' +
    '\n' +
    '        protected void Authentication_LoggedOut(object sender, EventArgs e)\n' +
    '        {\n' +
    '            FormsAuthentication.SignOut();\n' +
    '            Roles.DeleteCookie();\n' +
    '            Session.Clear();\n' +
    '            Session.Abandon();\n' +
    '\n' +
    '            Response.Redirect("/");\n' +
    '        }\n' +
    '\n' +
    '        protected void Authentication_LoginError(object sender, EventArgs e)\n' +
    '        {\n' +
    '            // Since the login is toggled from JS, add script to page to show the login box\n' +
    '            Page.ClientScript.RegisterClientScriptBlock(Page.GetType(), "failed-login", "jQuery(function(){ ShowLogin() })", true);\n' +
    '        }\n' +
    '\n' +
    '        #endregion\n' +
    '\n' +
    '        #region Build Number\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Gets the version number stored in our build.number file. This\n' +
    '        /// number hardly ever changes (once a day or so, and then the server\n' +
    '        /// is restarted) so we store it in a shared memory location and only ever\n' +
    '        /// get it once.\n' +
    '        /// </summary>\n' +
    '        /// <returns></returns>\n' +
    '        protected static Version Version\n' +
    '        {\n' +
    '            get\n' +
    '            {\n' +
    '                // Lazy loading/singleton implementation\n' +
    '                if (_version == null)\n' +
    '                {\n' +
    '                    _version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;\n' +
    '                }\n' +
    '                return _version;\n' +
    '            }\n' +
    '        }\n' +
    '        private static Version _version;\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Display Exceptions if they occurred during the loading of this page (incl. controls used by this page)\n' +
    '        /// </summary>\n' +
    '        public override void RenderControl(System.Web.UI.HtmlTextWriter writer)\n' +
    '        {\n' +
    '            if (ShowDebug)\n' +
    '            {\n' +
    '                var exceptions = Global.GetExceptions();\n' +
    '                if (exceptions.Count > 0)\n' +
    '                {\n' +
    '                    ExceptionNoticeSpan.Visible = Exceptions.Visible = true;\n' +
    '                    ExceptionNotice.InnerText = string.Format("{0} Exception{1} Occurred", exceptions.Count, exceptions.Count > 1 ? "s" : "");\n' +
    '\n' +
    '                    foreach (var exceptionPair in exceptions)\n' +
    '                    {\n' +
    '                        Exceptions.InnerHtml += string.Format(\n' +
    '                            "<div class=\\"pmi-error grid_16\\"><a //// \\\\\\" href=\\"javascript://\\" onclick=\\"$(this).css({{whiteSpace:\'normal\',overflow:\'visible\',height:\'inherit\'}}).next().toggle(\'fast\')\\">{0}</a><div style=\\"display:none\\">{1}</div></div>",\n' +
    '                            Server.HtmlEncode(exceptionPair.Key), (exceptionPair.Value != null ? Server.HtmlEncode(exceptionPair.Value.ToString()) : "&lt; empty stack trace &gt;"));\n' +
    '                    }\n' +
    '                }\n' +
    '            }\n' +
    '\n' +
    '            base.RenderControl(writer);\n' +
    '        }\n' +
    '\n' +
    '        protected bool ShowDebug\n' +
    '        {\n' +
    '            get\n' +
    '            {\n' +
    '                if (!HttpContext.Current.User.Identity.IsAuthenticated)\n' +
    '                {\n' +
    '                    _showDebug = false;\n' +
    '                }\n' +
    '                else if (Roles.IsUserInRole("TechAdmin"))\n' +
    '                {\n' +
    '                    _showDebug = true;\n' +
    '                }\n' +
    '                else\n' +
    '                {\n' +
    '                    _showDebug = false;\n' +
    '                }\n' +
    '\n' +
    '                return _showDebug;\n' +
    '            }\n' +
    '        }\n' +
    '        private bool _showDebug;\n' +
    '\n' +
    '        #endregion\n' +
    '\n' +
    '        #region AdvertisingURLS\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Gets the environment specific URL for the advertising in the right\n' +
    '        /// column of the home page.\n' +
    '        /// </summary>\n' +
    '        /// <returns></returns>\n' +
    '        protected static string advertisingURLRightColumn\n' +
    '        {\n' +
    '            get\n' +
    '            {\n' +
    '                // Lazy loading/singleton implementation\n' +
    '                if (_advertisingURLRightColumn == null)\n' +
    '                {\n' +
    '                    _advertisingURLRightColumn = "http://" + WebEnvironment.Instance.GetHostName("www") + "/GLOBALS/Ads/MarketPlace-Right-1st.aspx";\n' +
    '                }\n' +
    '                return _advertisingURLRightColumn;\n' +
    '            }\n' +
    '        }\n' +
    '        private static string _advertisingURLRightColumn;\n' +
    '\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Gets the environment specific URL for the advertising in the right\n' +
    '        /// column of the home page.\n' +
    '        /// </summary>\n' +
    '        /// <returns></returns>\n' +
    '        protected static string advertisingURLFooter\n' +
    '        {\n' +
    '            get\n' +
    '            {\n' +
    '                // Lazy loading/singleton implementation\n' +
    '                if (_advertisingURLFooter == null)\n' +
    '                {\n' +
    '                    _advertisingURLFooter = "http://" + WebEnvironment.Instance.GetHostName("www") + "/GLOBALS/Ads/MarketPlace-Footer.aspx";\n' +
    '                }\n' +
    '                return _advertisingURLFooter;\n' +
    '            }\n' +
    '        }\n' +
    '        private static string _advertisingURLFooter;\n' +
    '\n' +
    '        #endregion\n' +
    '    }\n' +
    '}\n');