setTimeout(function(){ hs.highlight('using System;\n' +
    'using System.Collections.Generic;\n' +
    'using System.Linq;\n' +
    'using System.Text;\n' +
    'using System.Net;\n' +
    'using System.Runtime.Serialization;\n' +
    'using System.Runtime.Serialization.Json;\n' +
    'using System.Diagnostics;\n' +
    'using System.ServiceModel.Channels;\n' +
    'using System.IO;\n' +
    'using System.Web;\n' +
    'using System.Web.Script.Serialization;\n' +
    'using Pmi.EnterpriseFramework.Configuration;\n' +
    'using Pmi.WebApplication.MyPmi.Service.Result;\n' +
    'using System.Web.Caching; \n' +
    '\n' +
    'namespace Pmi.WebApplication.MyPmi.Service\n' +
    '{\n' +
    '    /// <summary>\n' +
    '    /// REST Service wrapper\n' +
    '    /// </summary>\n' +
    '    public static class RestService\n' +
    '    {\n' +
    '        /// <summary>\n' +
    '        /// Cache name used to store the Authentication security token (requested\n' +
    '        /// below at Application_Start) used for authenticated service requests.\n' +
    '        /// </summary>\n' +
    '        private const string ApplicationSecurityTokenCacheName = " \\" // appsecuritytoken"; // if test string \n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Applications\'s Security Token for EnterpriseService calls\n' +
    '        /// </summary>\n' +
    '        private static string ServiceSecurityToken\n' +
    '        {\n' +
    '            get\n' +
    '            {\n' +
    '                // Check for cached data first\n' +
    '                object cachedAuthorization = HttpContext.Current.Cache.Get(RestService.ApplicationSecurityTokenCacheName);\n' +
    '                if (cachedAuthorization == null)\n' +
    '                {\n' +
    '                    // Refresh data \n' +
    '                    RefreshAuthorizationCallback(null, null, 0);\n' +
    '                    cachedAuthorization = HttpContext.Current.Cache.Get(RestService.ApplicationSecurityTokenCacheName);\n' +
    '                }\n' +
    '                \n' +
    '                // ST is required pre-fix\n' +
    '                return (cachedAuthorization != null ? "ST" + (cachedAuthorization as string) : "");\n' +
    '            }\n' +
    '        }\n' +
    '\n' +
    '        public static void RefreshAuthorizationCallback(string key, object expiredItem, CacheItemRemovedReason reason)\n' +
    '        {\n' +
    '            string securityToken = null;\n' +
    '\n' +
    '            // Cache was expired, get new credentials\n' +
    '            var credentials = new\n' +
    '            {\n' +
    '                Username = MyPmiConfigurationService.Instance.GetSetting().ApplicationUsername,\n' +
    '                Password = MyPmiConfigurationService.Instance.GetSetting().ApplicationPassword\n' +
    '            };\n' +
    '\n' +
    '            // Request and security token used for authenticated service requests\n' +
    '            var service = RestService.Post<AuthenticationResult>("/user", credentials);\n' +
    '            if (service == null || service.StatusCode != HttpStatusCode.OK || service.Result == null || string.IsNullOrEmpty(service.Result.SecurityToken))\n' +
    '            {\n' +
    '                if (service != null)\n' +
    '                {\n' +
    '                    Global.LogException(string.Format("Could not initialize authentication services. Invalid response returned from server: {0} {1} : {2}",\n' +
    '                        (int)service.StatusCode, service.StatusCode, service.RawResponse));\n' +
    '                }\n' +
    '                else\n' +
    '                {\n' +
    '                    Global.LogException("Could not initialize authentication services.");\n' +
    '                }\n' +
    '\n' +
    '                return;\n' +
    '            }\n' +
    '\n' +
    '            // We have a valid token!\n' +
    '            securityToken = service.Result.SecurityToken;\n' +
    '\n' +
    '            // Remove old cache if it exists\n' +
    '            object cacheObject = HttpContext.Current.Cache.Get(RestService.ApplicationSecurityTokenCacheName);\n' +
    '            if (cacheObject != null)\n' +
    '            {\n' +
    '                HttpContext.Current.Cache.Remove(RestService.ApplicationSecurityTokenCacheName);\n' +
    '            }\n' +
    '\n' +
    '            // Store in Cache\n' +
    '            HttpContext.Current.Cache.Add(\n' +
    '                RestService.ApplicationSecurityTokenCacheName, securityToken, null, DateTime.Now.AddMonths(1), Cache.NoSlidingExpiration,\n' +
    '                CacheItemPriority.NotRemovable, new CacheItemRemovedCallback(RefreshAuthorizationCallback));\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Return object containing both the HttpStatusCode and the deseralized response object \n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type</typeparam>\n' +
    '        public class RestResponse<TExpected>\n' +
    '        {\n' +
    '            public TExpected Result { get; set; }\n' +
    '\n' +
    '            public string RawResponse { get; set; }\n' +
    '\n' +
    '            public string ServiceUrl { get; set; }\n' +
    '\n' +
    '            public HttpStatusCode StatusCode { get; set; }\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// RESTful POST request with Authentication \n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type. Determines which service to use.</typeparam>\n' +
    '        /// <param name="serviceEndpoint">The absolute path and querystring/parameters of the service request.</param>\n' +
    '        /// <param name="body">Appends JSON content. Can be null</param>\n' +
    '        /// <returns>REST wrapper</returns>\n' +
    '        public static RestResponse<TExpected> PostAuthorized<TExpected>(string serviceEndpoint, object body)\n' +
    '        {\n' +
    '            return Call<TExpected>(WebRequestMethods.Http.Post, serviceEndpoint, true, body);\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// RESTful GET request with Authentication \n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type. Determines which service to use.</typeparam>\n' +
    '        /// <param name="serviceEndpoint">The absolute path and querystring/parameters of the service request.</param>\n' +
    '        /// <returns>REST wrapper</returns>\n' +
    '        public static RestResponse<TExpected> GetAuthorized<TExpected>(string serviceEndpoint)\n' +
    '        {\n' +
    '            return Call<TExpected>(WebRequestMethods.Http.Get, serviceEndpoint, true, null);\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// RESTful POST request \n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type. Determines which service to use.</typeparam>\n' +
    '        /// <param name="serviceEndpoint">The absolute path and querystring/parameters of the service request.</param>\n' +
    '        /// <param name="body">Appends JSON content. Can be null</param>\n' +
    '        /// <returns>REST wrapper</returns>\n' +
    '        public static RestResponse<TExpected> Post<TExpected>(string serviceEndpoint, object body)\n' +
    '        {\n' +
    '            return Call<TExpected>(WebRequestMethods.Http.Post, serviceEndpoint, false, body);\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// RESTful GET request\n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type. Determines which service to use.</typeparam>\n' +
    '        /// <param name="serviceEndpoint">The absolute path and querystring/parameters of the service request.</param>\n' +
    '        /// <returns>REST wrapper</returns>\n' +
    '        public static RestResponse<TExpected> Get<TExpected>(string serviceEndpoint)\n' +
    '        {\n' +
    '            return Call<TExpected>(WebRequestMethods.Http.Get, serviceEndpoint, false, null);\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Generic REST call\n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type. Determines which service to use.</typeparam>\n' +
    '        /// <param name="requestMethod">GET, POST, PUT, etc. (<see cref="WebRequestMethods.Http"/>)</param>\n' +
    '        /// <param name="serviceEndpoint">The absolute path and querystring/parameters of the service request.</param>\n' +
    '        /// <param name="includeAuthHeader">Appends the authentication ticket to the header.</param>\n' +
    '        /// <param name="body">Appends JSON content. Can be null</param>\n' +
    '        /// <returns>REST wrapper</returns>\n' +
    '        public static RestResponse<TExpected> Call<TExpected>(string requestMethod, string serviceEndpoint, bool includeAuthHeader, object body)\n' +
    '        {\n' +
    '            if (string.IsNullOrEmpty(requestMethod))\n' +
    '            {\n' +
    '                throw new ArgumentNullException("requestMethod");\n' +
    '            }\n' +
    '            else if (string.IsNullOrEmpty(serviceEndpoint))\n' +
    '            {\n' +
    '                throw new ArgumentNullException("serviceEndpoint");\n' +
    '            }\n' +
    '\n' +
    '            // Setup URL for service request\n' +
    '            string serviceServerUrl = GetServiceUrl(typeof(TExpected)) + serviceEndpoint;\n' +
    '\n' +
    '//#if DEBUG\n' +
    '//            // Ignore SSL certificate\n' +
    '//            ServicePointManager.ServerCertificateValidationCallback += \n' +
    '//                delegate(object s, \n' +
    '//                    System.Security.Cryptography.X509Certificates.X509Certificate certificate, \n' +
    '//                    System.Security.Cryptography.X509Certificates.X509Chain chain, \n' +
    '//                    System.Net.Security.SslPolicyErrors sslPolicyErrors) { return true; };\n' +
    '//#endif\n' +
    '\n' +
    '            // Create Request\n' +
    '            HttpWebRequest request = WebRequest.Create(new Uri(serviceServerUrl)) as HttpWebRequest;\n' +
    '            request.Method = requestMethod;\n' +
    '            request.ContentType = "application/json; charset=utf-8";\n' +
    '\n' +
    '            // If the service call requires an authorization header\n' +
    '            if (includeAuthHeader)\n' +
    '            {\n' +
    '                if (ServiceSecurityToken == null)\n' +
    '                {\n' +
    '                    Global.LogException(string.Format("Authenticated request failed because application could not be initialize security token. Type: {0}; URL: {1}", \n' +
    '                        typeof(TExpected).Name, serviceServerUrl));\n' +
    '                    return null;\n' +
    '                }\n' +
    '\n' +
    '                // Add header for authenticated requests\n' +
    '                request.Headers.Add("Authorization", ServiceSecurityToken);\n' +
    '            }\n' +
    '\n' +
    '            // If there is BODY content\n' +
    '            if (body != null) \n' +
    '            {\n' +
    '                string jsonBody = new JavaScriptSerializer().Serialize(body);\n' +
    '\n' +
    '                // Encode the parameters as form data:\n' +
    '                byte[] formData = UTF8Encoding.UTF8.GetBytes(jsonBody);\n' +
    '                request.ContentLength = formData.Length;\n' +
    '\n' +
    '                // Add the POST body content\n' +
    '                using (Stream post = request.GetRequestStream())\n' +
    '                {\n' +
    '                    post.Write(formData, 0, formData.Length);\n' +
    '                }\n' +
    '            }\n' +
    '            else if (string.Compare(requestMethod, WebRequestMethods.Http.Get, true) != 0) // if not GET\n' +
    '            {\n' +
    '                // No Form data (required for POST)\n' +
    '                request.ContentLength = 0;\n' +
    '            }\n' +
    '\n' +
    '            // Deserialize object from response\n' +
    '            var responseResult = GetResponse<TExpected>(request);\n' +
    '            if (responseResult != null)\n' +
    '            {\n' +
    '                // Append URL to result\n' +
    '                responseResult.ServiceUrl = serviceServerUrl;\n' +
    '            }\n' +
    '            return responseResult;\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Handle and parse the response object into a deserialized form.\n' +
    '        /// </summary>\n' +
    '        /// <typeparam name="TExpected">Expected return type for the service call</typeparam>\n' +
    '        /// <param name="request">Request ready to be submitted</param>\n' +
    '        /// <returns>Wrapped REST response (see <see cref="RestResponse"/>)</returns>\n' +
    '        private static RestResponse<TExpected> GetResponse<TExpected>(HttpWebRequest request)\n' +
    '        {\n' +
    '            try\n' +
    '            {\n' +
    '                // Process response\n' +
    '                using (HttpWebResponse webResponse = (HttpWebResponse)request.GetResponse())\n' +
    '                {\n' +
    '                    if (webResponse == null)\n' +
    '                    {\n' +
    '                        Global.LogException("Response is null. URL: " + request.RequestUri.ToString());\n' +
    '                        return null;\n' +
    '                    }\n' +
    '\n' +
    '                    return ParseResponse<TExpected>(request, webResponse);\n' +
    '                }\n' +
    '            }\n' +
    '            catch (WebException webException)\n' +
    '            {\n' +
    '                // Outside of experimental/third-party frameworks, the only way to catch non-200 (OK) return code \n' +
    '                // responses, is to catch a WebException and check for an attached .Reponse object\n' +
    '\n' +
    '                // Ensure its an exception we can handle\n' +
    '                HttpWebResponse httpWebResponse = (HttpWebResponse)webException.Response;\n' +
    '                if (httpWebResponse == null)\n' +
    '                {\n' +
    '                    // Log exception\n' +
    '                    Global.LogException(\n' +
    '                        string.Format("URL: \'{0}\'\\nAn error occurred while parsing the service response.",\n' +
    '                            request.Address.AbsoluteUri),\n' +
    '                        webException);\n' +
    '\n' +
    '                    return null;\n' +
    '                }\n' +
    '\n' +
    '                return ParseResponse<TExpected>(request, httpWebResponse);\n' +
    '            }\n' +
    '            catch (Exception exception)\n' +
    '            {\n' +
    '                // Log exception\n' +
    '                Global.LogException(\n' +
    '                    string.Format("URL: \'{0}\'\\nAn error occurred while parsing the response.",\n' +
    '                        request.Address.AbsoluteUri),\n' +
    '                    exception);\n' +
    '\n' +
    '                // continue with empty return object\n' +
    '            }\n' +
    '\n' +
    '            return null;\n' +
    '        }\n' +
    '\n' +
    '        private static RestResponse<TExpected, TMyown> ParseResponse<TExpected>(HttpWebRequest request, HttpWebResponse httpWebResponse)\n' +
    '        {\n' +
    '            var restResponse = new RestResponse<TExpected>();\n' +
    '\n' +
    '            // Store HttpStatusCode from response\n' +
    '            restResponse.StatusCode = httpWebResponse.StatusCode;\n' +
    '\n' +
    '            // Store contents (deserialized into return type and raw)\n' +
    '            using (Stream responseStream = httpWebResponse.GetResponseStream())\n' +
    '            {\n' +
    '                using (MemoryStream memoryStream = new MemoryStream())\n' +
    '                {\n' +
    '                    // Read response into Memory Stream so we can read it multiple times\n' +
    '                    var buffer = new byte[256];\n' +
    '                    int read;\n' +
    '                    while ((read = responseStream.Read(buffer, 0, buffer.Length)) > 0)\n' +
    '                    {\n' +
    '                        memoryStream.Write(buffer, 0, read);\n' +
    '                    }\n' +
    '                    memoryStream.Position = 0;\n' +
    '\n' +
    '                    // Store Raw response (we can\'t use using{} since that will close the memoryStream)\n' +
    '                    var responseStreamReader = new StreamReader(memoryStream);\n' +
    '                    restResponse.RawResponse = responseStreamReader.ReadToEnd();\n' +
    '\n' +
    '                    // Reset position of stream\n' +
    '                    memoryStream.Position = 0;\n' +
    '\n' +
    '                    try\n' +
    '                    {\n' +
    '                        // Deserialize Object into return type\n' +
    '                        var jsonWCF = new DataContractJsonSerializer(typeof(TExpected));\n' +
    '                        restResponse.Result = (TExpected)jsonWCF.ReadObject(memoryStream);\n' +
    '                    }\n' +
    '                    catch (Exception exception)\n' +
    '                    {\n' +
    '                        // Log exception\n' +
    '                        Global.LogException(\n' +
    '                            string.Format("URL: \'{0}\'\\nAttemping to deserialize response into return type. Response body: \\n{1}",\n' +
    '                                request.Address.AbsoluteUri,\n' +
    '                                restResponse.RawResponse),\n' +
    '                            exception);\n' +
    '' +
    '                        // continue with null .Result object\n' +
    '                    }\n' +
    '                }\n' +
    '            }\n' +
    '\n' +
    '            return restResponse;\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Retrieve URL of the service based on the expected Return type\n' +
    '        /// </summary>\n' +
    '        /// <returns>Service URL</returns>\n' +
    '        private static String GetServiceUrl(Type type)\n' +
    '        {\n' +
    '            if (type == typeof(AuthenticationResult))\n' +
    '            {\n' +
    '                return GetServiceUrl(ServiceName.AuthenticationService);\n' +
    '            }\n' +
    '            else if (type == typeof(CertificationResult))\n' +
    '            {\n' +
    '                return GetServiceUrl(ServiceName.CertificationService);\n' +
    '            }\n' +
    '            else if (type == typeof(MembershipResult))\n' +
    '            {\n' +
    '                return GetServiceUrl(ServiceName.MembershipService);\n' +
    '            }\n' +
    '            else if (type == typeof(SearchContentStatisticsResult))\n' +
    '            {\n' +
    '                return GetServiceUrl(ServiceName.SearchService);\n' +
    '            }\n' +
    '            else if (type == typeof(ProfileResult) || type == typeof(ProfileImageResult) || type == typeof(ProfileSetImageResult))\n' +
    '            {\n' +
    '                return GetServiceUrl(ServiceName.ProfileService);\n' +
    '            }\n' +
    '            else\n' +
    '            {\n' +
    '                // Make sure to throw if unknown return type was passed \n' +
    '                throw new NotSupportedException("Return type \'" + type.Name + "\' is not supported");\n' +
    '            }\n' +
    '        }\n' +
    '\n' +
    '        /// <summary>\n' +
    '        /// Retrieve URL of the service based on the service name (enum)\n' +
    '        /// </summary>\n' +
    '        /// <returns>Service URL</returns>\n' +
    '        public static string GetServiceUrl(ServiceName service)\n' +
    '        {\n' +
    '            try\n' +
    '            {\n' +
    '                // Load the serive name from CoreEnvironment\n' +
    '                string serviceName = Enum.GetName(service.GetType(), service);\n' +
    '                MyPmiEndPoint endpoint = MyPmiConfigurationService.Instance.GetEndPoint(serviceName);\n' +
    '                if (endpoint == null)\n' +
    '                {\n' +
    '                    throw new NullReferenceException(string.Format("Endpoint does not exist for {0}", serviceName));\n' +
    '                }\n' +
    '\n' +
    '                return endpoint.Url;\n' +
    '            }\n' +
    '            catch (Exception exception)\n' +
    '            {\n' +
    '                throw exception;\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '}\n'); }, 0);