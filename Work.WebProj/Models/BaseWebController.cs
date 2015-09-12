using DotWeb.CommSetup;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using ProcCore;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using ProcCore.NetExtension;
using ProcCore.WebCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace DotWeb
{
    #region 基底控制器
    public abstract class SourceController : System.Web.Mvc.Controller
    {
        //protected string IP;
        protected C39A0_NAKATOMIEntities db0;
        protected virtual string getRecMessage(string MsgId)
        {
            String r = Resources.Res.ResourceManager.GetString(MsgId);
            return String.IsNullOrEmpty(r) ? MsgId : r;
        }
        protected virtual string getRecMessage(List<i_Code> codeSheet, string code)
        {

            var c = codeSheet.Where(x => x.Code == code).FirstOrDefault();

            if (c == null)
                return code;
            else
            {
                string r = Resources.Res.ResourceManager.GetString(c.LangCode);
                return string.IsNullOrEmpty(r) ? c.Value : r;
            }
        }
        protected string defJSON(object o)
        {
            return JsonConvert.SerializeObject(o, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore });
        }
        protected TransactionScope defAsyncScope()
        {
            return new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        }
        protected virtual LogicCenter openLogic()
        {
            LogicCenter dbLogic = new LogicCenter(CommSetup.CommWebSetup.DB0_CodeString);

            dbLogic.IP = System.Web.HttpContext.Current.Request.UserHostAddress;

            return dbLogic;
        }
        protected string getNowLnag()
        {
            return System.Globalization.CultureInfo.CurrentCulture.Name;
        }
        protected static C39A0_NAKATOMIEntities getDB0()
        {
            LogicCenter.SetDB0EntityString(CommSetup.CommWebSetup.DB0_CodeString);
            return LogicCenter.getDB0;
        }
    }
    [Authorize]
    public abstract class AdminController : SourceController
    {
        protected string UserId; //
        protected string aspUserId;
        protected int departmentId;

        protected int defPageSize = 0;

        //訂義取得本次執行 Controller Area Action名稱
        protected string get_controller = string.Empty;
        protected string get_area = string.Empty;
        protected string get_action = string.Empty;

        //訂義檔案上傳路行樣板
        protected string upload_path_tpl_o = "~/_Upload/{0}/{1}/{2}/{3}/{4}";
        protected string upload_path_tpl_s = "~/_Upload/{0}/{1}/{2}/{3}";
        //訂義檔案刪除路徑樣板
        protected string delete_file_path_tpl = "~/_Upload/{0}/{1}/{2}";
        //系統認可圖片檔副檔名
        protected string[] imgExtDef = new string[] { ".jpg", ".jpeg", ".gif", ".png", ".bmp" };

        private ApplicationUserManager _userManager;

        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);
            var getUserIdCookie = Request.Cookies["user_id"];

            var getUserName = Request.Cookies["user_name"];

            UserId = getUserIdCookie == null ? null : getUserIdCookie.Value;

            ViewBag.UserId = UserId;
            ViewBag.UserName = getUserName == null ? "" : Server.UrlDecode(getUserName.Value);

            var aspnet_user_id = User.Identity.GetUserId();
            ApplicationUser aspnet_user = UserManager.FindById(aspnet_user_id);
            string asp_net_roles = aspnet_user.Roles.Select(x => x.RoleId).FirstOrDefault();
            var role = roleManager.FindById(asp_net_roles);
            ViewBag.RoleName = role.Name;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        public RoleManager<IdentityRole> roleManager
        {
            get
            {
                ApplicationDbContext context = ApplicationDbContext.Create();
                return new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            }
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            this.aspUserId = User.Identity.GetUserId();
            this.departmentId = int.Parse(Request.Cookies[CommWebSetup.Cookie_DepartmentId].Value);

            Log.SetupBasePath = System.Web.HttpContext.Current.Server.MapPath("~\\_Code\\Log\\");
            Log.Enabled = true;

            //plamInfo.BroswerInfo = System.Web.HttpContext.Current.Request.Browser.Browser + "." + System.Web.HttpContext.Current.Request.Browser.Version;
            //plamInfo.IP = this.IP;

            //plamInfo.UnitId = departmentId;

            defPageSize = CommSetup.CommWebSetup.MasterGridDefPageSize;
            this.get_controller = ControllerContext.RouteData.Values["controller"].ToString();
            this.get_area = ControllerContext.RouteData.DataTokens["area"].ToString();
            this.get_action = ControllerContext.RouteData.Values["action"].ToString();
        }
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            Log.WriteToFile();
        }
        protected void ActionRun()
        {
            ViewBag.area = this.get_area;
            ViewBag.controller = this.get_controller;
            using (db0 = getDB0())
            {
                ViewBag.Langs = db0.i_Lang.Where(x => x.isuse == true).OrderBy(x => x.sort).ToList();
            }
        }
        public int getNewId()
        {
            return getNewId(ProcCore.Business.CodeTable.Base);
        }
        public int getNewId(ProcCore.Business.CodeTable tab)
        {

            //using (TransactionScope tx = new TransactionScope())
            //{
            var db = getDB0();
            try
            {
                string tab_name = Enum.GetName(typeof(ProcCore.Business.CodeTable), tab);
                var items = db.i_IDX.Where(x => x.table_name == tab_name).FirstOrDefault();

                if (items == null)
                {
                    return 0;
                }
                else
                {
                    //var item = items.FirstOrDefault();
                    items.IDX++;
                    db.SaveChanges();
                    //tx.Complete();
                    return items.IDX;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return 0;
            }
            finally
            {
                db.Dispose();
            }
            //}
        }
        protected void handleFileSave(string file_name, int id, FilesUpScope fp, string file_kind, string category1, string category2)
        {
            Stream file_stream = Request.InputStream;
            BinaryReader binary_read = new BinaryReader(file_stream);
            string file_ext = System.IO.Path.GetExtension(file_name);

            #region IE file stream handle

            string[] IEOlderVer = new string[] { "6.0", "7.0", "8.0", "9.0" };
            System.Web.HttpPostedFile GetPostFile = null;
            if (Request.Browser.Browser == "IE" && IEOlderVer.Any(x => x == Request.Browser.Version))
            {
                System.Web.HttpFileCollection collectFiles = System.Web.HttpContext.Current.Request.Files;
                GetPostFile = collectFiles[0];
                if (!GetPostFile.FileName.Equals(""))
                {
                    binary_read = new BinaryReader(GetPostFile.InputStream);
                }
            }

            Byte[] fileContents = { };

            while (binary_read.BaseStream.Position < binary_read.BaseStream.Length - 1)
            {
                Byte[] buffer = new Byte[binary_read.BaseStream.Length - 1];
                int read_line = binary_read.Read(buffer, 0, buffer.Length);
                Byte[] dummy = fileContents.Concat(buffer).ToArray();
                fileContents = dummy;
                dummy = null;
            }
            #endregion

            string tpl_Org_FolderPath = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string Org_Path = Server.MapPath(tpl_Org_FolderPath);

            #region 檔案上傳前檢查
            if (fp.limitSize > 0)
                if (binary_read.BaseStream.Length > fp.limitSize)
                    throw new LogicError("Log_Err_FileSizeOver");

            if (fp.limitCount > 0 && Directory.Exists(Org_Path))
            {
                string[] Files = Directory.GetFiles(Org_Path);
                if (Files.Count() >= fp.limitCount)
                    throw new LogicError("Log_Err_FileCountOver");
            }

            if (fp.allowExtType != null)
                if (!fp.allowExtType.Contains(file_ext.ToLower()))
                    throw new LogicError("Log_Err_AllowFileType");

            if (fp.limitExtType != null)
                if (fp.limitExtType.Contains(file_ext))
                    throw new LogicError("Log_Err_LimitedFileType");
            #endregion

            #region 存檔區

            if (!System.IO.Directory.Exists(Org_Path)) { System.IO.Directory.CreateDirectory(Org_Path); }

            FileStream write_stream = new FileStream(Org_Path + "\\" + file_name, FileMode.Create);
            BinaryWriter binary_write = new BinaryWriter(write_stream);
            binary_write.Write(fileContents);

            file_stream.Close();
            write_stream.Close();
            binary_write.Close();

            #endregion
        }
        protected void handleImageSave(string file_name, int id, ImageUpScope fp, string file_kind, string category1, string category2)
        {
            BinaryReader binary_read = null;
            string file_ext = System.IO.Path.GetExtension(file_name); //取得副檔名
            string[] ie_older_ver = new string[] { "6.0", "7.0", "8.0", "9.0" };

            if (Request.Browser.Browser == "IE" && ie_older_ver.Any(x => x == Request.Browser.Version))
            {
                #region IE file stream handle
                HttpPostedFile get_post_file = System.Web.HttpContext.Current.Request.Files[0];
                if (!get_post_file.FileName.Equals(""))
                    binary_read = new BinaryReader(get_post_file.InputStream);
                #endregion
            }
            else
                binary_read = new BinaryReader(Request.InputStream);

            byte[] upload_file = binary_read.ReadBytes(System.Convert.ToInt32(binary_read.BaseStream.Length));

            string web_path_org = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "origin");
            string server_path_org = Server.MapPath(web_path_org);

            #region 檔案上傳前檢查
            if (fp.limitSize > 0) //檔案大小檢查
                if (binary_read.BaseStream.Length > fp.limitSize)
                    throw new LogicError("Log_Err_FileSizeOver");

            if (fp.limitCount > 0 && Directory.Exists(server_path_org))
            {
                string[] Files = Directory.GetFiles(server_path_org);
                if (Files.Count() >= fp.limitCount) //還沒存檔，因此Selet到等於的數量，再加上現在要存的檔案即算超過
                    throw new LogicError("Log_Err_FileCountOver");
            }

            if (fp.allowExtType != null)
                if (!fp.allowExtType.Contains(file_ext.ToLower()))
                    throw new LogicError("Log_Err_AllowFileType");

            if (fp.limitExtType != null)
                if (fp.limitExtType.Contains(file_ext))
                    throw new LogicError("Log_Err_LimitedFileType");
            #endregion
            #region 存檔區

            if (fp.keepOrigin)
            {
                //原始檔
                if (!System.IO.Directory.Exists(server_path_org)) { System.IO.Directory.CreateDirectory(server_path_org); }

                FileStream file_stream = new FileStream(server_path_org + "\\" + file_name, FileMode.Create);
                BinaryWriter binary_write = new BinaryWriter(file_stream);
                binary_write.Write(upload_file);

                file_stream.Close();
                binary_write.Close();
            }

            //後台管理的ICON小圖
            string web_path_icon = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "icon");
            string server_path_icon = Server.MapPath(web_path_icon);
            if (!System.IO.Directory.Exists(server_path_icon)) { System.IO.Directory.CreateDirectory(server_path_icon); }
            MemoryStream smr = resizeImage(upload_file, 0, 90);
            System.IO.File.WriteAllBytes(server_path_icon + "\\" + Path.GetFileName(file_name), smr.ToArray());
            smr.Dispose();

            //依據參數進行裁圖
            if (fp.Parm.Count() > 1)//存兩種以上圖片大小
            {
                foreach (ImageSizeParm imSize in fp.Parm)
                {
                    string web_path_parm = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, imSize.folderName);
                    string server_path_parm = Server.MapPath(web_path_parm);
                    if (!System.IO.Directory.Exists(server_path_parm)) { System.IO.Directory.CreateDirectory(server_path_parm); }//找不到路徑
                    MemoryStream sm = resizeImage(upload_file, imSize.width, imSize.heigh);
                    System.IO.File.WriteAllBytes(server_path_parm + "\\" + Path.GetFileName(file_name), sm.ToArray());
                    sm.Dispose();
                }
            }
            else if (fp.Parm.Count() > 0)
            {//只存一種
                string web_path_parm = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
                string server_path_parm = Server.MapPath(web_path_parm);
                foreach (ImageSizeParm imSize in fp.Parm)
                {
                    MemoryStream sm = resizeImage(upload_file, imSize.width, imSize.heigh);
                    System.IO.File.WriteAllBytes(server_path_parm + "\\" + Path.GetFileName(file_name), sm.ToArray());
                    sm.Dispose();
                }

            }
            #endregion

            #region Handle Json Info
            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> f = null;
            int sort = 0;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                f = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                if (f.Any(x => x.fileName == file_name))
                {
                    return;
                }

                sort = f.Count + 1;
            }
            else
            {
                f = new List<JsonFileInfo>();
                sort = 1;
            }



            f.Add(new JsonFileInfo()
            {
                fileName = file_name,
                sort = sort
            });

            var json_string = JsonConvert.SerializeObject(f);
            System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
            #endregion
        }
        protected MemoryStream resizeImage(byte[] s, int new_width, int new_hight)
        {
            try
            {
                TypeConverter tc = TypeDescriptor.GetConverter(typeof(Bitmap));
                Bitmap im = (Bitmap)tc.ConvertFrom(s);

                if (new_hight == 0)
                    new_hight = (im.Height * new_width) / im.Width;

                if (new_width == 0)
                    new_width = (im.Width * new_hight) / im.Height;

                if (im.Width < new_width)
                    new_width = im.Width;

                if (im.Height < new_hight)
                    new_hight = im.Height;

                EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 100L);
                EncoderParameters myEncoderParameter = new EncoderParameters(1);
                myEncoderParameter.Param[0] = qualityParam;

                ImageCodecInfo myImageCodecInfo = getEncoder(im.RawFormat);

                Bitmap ImgOutput = new Bitmap(im, new_width, new_hight);

                //ImgOutput.Save();
                MemoryStream ss = new MemoryStream();

                ImgOutput.Save(ss, myImageCodecInfo, myEncoderParameter);
                im.Dispose();
                return ss;
            }
            catch (Exception ex)
            {
                Log.Write("Image Handle Error:" + ex.Message);
                return null;
            }
            //ImgOutput.Dispose(); 
        }
        protected SerializeFile[] listImgFiles(int id, string file_kind, string category1, string category2)
        {
            string web_path_org = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "origin");
            string server_path_org = Server.MapPath(web_path_org);
            string web_path_icon = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "icon");

            List<SerializeFile> l_files = new List<SerializeFile>();

            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            string web_path_s = string.Format(upload_path_tpl_s, category1, category2, id, file_kind, "origin");
            string server_path_s = Server.MapPath(web_path_s);

            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                var get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort);
                foreach (var m in get_file_json_object)
                {
                    string get_file = server_path_org + "//" + m.fileName;
                    if (System.IO.File.Exists(get_file))
                    {
                        FileInfo file_info = new FileInfo(get_file);
                        SerializeFile file_object = new SerializeFile()
                        {
                            fileName = file_info.Name,
                            fileKind = file_kind,
                            iconPath = Url.Content(web_path_icon + "/" + file_info.Name),
                            originPath = Url.Content(web_path_org + "/" + file_info.Name),
                            size = file_info.Length,
                            isImage = true
                        };
                        l_files.Add(file_object);
                    }
                }
            }

            return l_files.ToArray();
        }
        private ImageCodecInfo getEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
        protected MemoryStream cropCenterImage(Byte[] s, int width, int heigh)
        {
            try
            {
                TypeConverter tc = TypeDescriptor.GetConverter(typeof(Bitmap));

                Bitmap ImgSource = (Bitmap)tc.ConvertFrom(s);
                Bitmap ImgOutput = new Bitmap(width, heigh);

                int x = (ImgSource.Width - width) / 2;
                int y = (ImgSource.Height - heigh) / 2;
                Rectangle cropRect = new Rectangle(x, y, width, heigh);

                using (Graphics g = Graphics.FromImage(ImgOutput))
                {
                    g.DrawImage(ImgSource, new Rectangle() { Height = heigh, Width = width, X = 0, Y = 0 }, cropRect, GraphicsUnit.Pixel);
                }

                MemoryStream ss = new MemoryStream();
                ImgOutput.Save(ss, ImgSource.RawFormat);
                ImgSource.Dispose();
                return ss;
            }
            catch (Exception ex)
            {
                Log.Write("Image Handle Error:" + ex.Message);
                return null;
            }
            //ImgOutput.Dispose(); 
        }
        protected void deleteFile(int id, string file_kind, string file_name, ImageUpScope im, string category1, string category2)
        {
            string tpl_FolderPath = Server.MapPath(string.Format(upload_path_tpl_s, category1, category2, id, file_kind));

            string handle_delete_file = tpl_FolderPath + "/" + file_name;
            if (System.IO.File.Exists(handle_delete_file))
                System.IO.File.Delete(handle_delete_file);
            #region Delete Run
            if (Directory.Exists(tpl_FolderPath))
            {
                var folders = Directory.GetDirectories(tpl_FolderPath);
                foreach (var folder in folders)
                {
                    string herefile = folder + "\\" + file_name;
                    if (System.IO.File.Exists(herefile))
                        System.IO.File.Delete(herefile);
                }
            }
            #endregion

            #region Handle Json Info
            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> get_file_json_object = null;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                var get_file_object = get_file_json_object.Where(x => x.fileName == file_name).FirstOrDefault();
                if (get_file_object != null)
                {
                    get_file_json_object.Remove(get_file_object);
                    int i = 1;
                    foreach (var file_object in get_file_json_object)
                    {
                        file_object.sort = i;
                        i++;
                    }
                    var json_string = JsonConvert.SerializeObject(get_file_json_object);
                    System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
                }
            }
            #endregion

        }
        protected void DeleteSysFile(int id, string file_kind, string file_name, ImageUpScope im, string category1, string category2)
        {
            string tpl_FolderPath = Server.MapPath(string.Format(upload_path_tpl_s, category1, category2, id, file_kind));

            string handle_delete_file = tpl_FolderPath + "/" + file_name;
            if (System.IO.File.Exists(handle_delete_file))
                System.IO.File.Delete(handle_delete_file);
            #region Delete Run
            if (Directory.Exists(tpl_FolderPath))
            {
                var folders = Directory.GetDirectories(tpl_FolderPath);
                foreach (var folder in folders)
                {
                    string herefile = folder + "\\" + file_name;
                    if (System.IO.File.Exists(herefile))
                        System.IO.File.Delete(herefile);
                }
            }
            #endregion

            #region Handle Json Info
            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";

            IList<JsonFileInfo> get_file_json_object = null;
            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json);
                var get_file_object = get_file_json_object.Where(x => x.fileName == file_name).FirstOrDefault();
                if (get_file_object != null)
                {
                    get_file_json_object.Remove(get_file_object);
                    int i = 1;
                    foreach (var file_object in get_file_json_object)
                    {
                        file_object.sort = i;
                        i++;
                    }
                    var json_string = JsonConvert.SerializeObject(get_file_json_object);
                    System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
                }
            }
            #endregion

        }
        protected void rewriteJsonFile(int id, string file_kind, string category1, string category2, IList<JsonFileInfo> json_file_object)
        {
            string file_json_web_path = string.Format(upload_path_tpl_s, category1, category2, id, file_kind);
            string file_json_server_path = Server.MapPath(file_json_web_path) + "\\file.json";
            if (System.IO.File.Exists(file_json_server_path))
            {
                string json_string = JsonConvert.SerializeObject(json_file_object);
                System.IO.File.WriteAllText(file_json_server_path, json_string, Encoding.UTF8);
            }
        }
        public FileResult downloadFile(int id, string file_kind, string file_name)
        {
            String SearchPath = String.Format(upload_path_tpl_o + "\\" + file_name, get_area, get_controller, id, file_kind, "OriginFile");
            String DownFilePath = Server.MapPath(SearchPath);

            FileInfo fi = null;
            if (System.IO.File.Exists(DownFilePath))
                fi = new FileInfo(DownFilePath);

            return File(DownFilePath, "application/" + fi.Extension.Replace(".", ""), Url.Encode(fi.Name));
        }
        public string imagePath(string category1, string category2, int id, string file_kind, string size_name)
        {
            string web_path = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, size_name);
            string server_path = Server.MapPath(web_path);

            if (Directory.Exists(server_path))
            {
                string collect_file = Directory.EnumerateFiles(server_path).FirstOrDefault();

                if (collect_file != null)
                {
                    FileInfo f = new FileInfo(collect_file);
                    return Url.Content(web_path) + "/" + f.Name;
                }
                else
                    return null;
            }
            else
                return null;
        }
        public PageImgShow[] imageIconLink(string category1, string category2, int id, string file_kind, string size_name)
        {
            string icon_path = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, "icon");
            string link_path = string.Format(upload_path_tpl_o, category1, category2, id, file_kind, size_name);

            string folder_path = Server.MapPath(icon_path);

            if (Directory.Exists(folder_path))
            {
                string[] collect_file = Directory.GetFiles(folder_path);
                List<PageImgShow> web_path = new List<PageImgShow>();
                foreach (var file_path in collect_file)
                {
                    FileInfo f = new FileInfo(file_path);
                    web_path.Add(new PageImgShow()
                    {
                        icon_path = Url.Content(icon_path) + "/" + f.Name,
                        link_path = Url.Content(link_path) + "/" + f.Name
                    });
                }
                return web_path.ToArray();
            }
            else
                return null;
        }
        public RedirectResult SetLanguage(string L, string A)
        {
            HttpCookie WebLang = new HttpCookie(DotWeb.CommSetup.CommWebSetup.WebCookiesId + ".Lang", L);
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(WebLang.Value);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(WebLang.Value);
            ViewBag.Lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            Response.Cookies.Add(WebLang);
            return Redirect(A);
        }
        public string ModelStateErrorPack()
        {
            List<string> errMessage = new List<string>();
            foreach (ModelState modelState in ModelState.Values)
                foreach (ModelError error in modelState.Errors)
                    errMessage.Add(error.ErrorMessage);

            return string.Join(":", errMessage);
        }
        protected override LogicCenter openLogic()
        {
            var o = base.openLogic();
            o.AspUserID = aspUserId;
            o.DepartmentId = departmentId;
            o.Lang = getNowLnag();
            return o;
        }
        protected void AddTextToImg(string fileName, string text)
        {
            if (!System.IO.File.Exists(Server.MapPath(fileName)))
            {
                throw new FileNotFoundException("The file don't exist!");
            }
            if (text == string.Empty) { return; }

            byte[] imageData = ReadFile(Server.MapPath(fileName));
            MemoryStream ms = new MemoryStream(imageData);

            Image image = Image.FromStream(ms);
            Bitmap bitmap = new Bitmap(image, image.Width, image.Height);
            Graphics g = Graphics.FromImage(bitmap);

            try
            {
                float fontSize = Convert.ToSingle(image.Width * 0.06);    //字体大小  
                float textWidth = text.Length * fontSize;  //文本的长度  
                //下面定义一个矩形区域，以后在这个矩形里画上白底黑字
                float rectX = Convert.ToSingle(image.Width * 0.018);
                float rectY = Convert.ToSingle(image.Height * 0.018);
                //float rectWidth = text.Length * (fontSize + Convert.ToSingle(image.Width * 0.025));
                //float rectHeight = fontSize + Convert.ToSingle(image.Height * 0.035);
                //因為背景設定透明,所以聲明矩形大小設定和原圖一樣大
                float rectWidth = image.Width;
                float rectHeight = image.Height;
                //声明矩形域  
                RectangleF textArea = new RectangleF(rectX, rectY, rectWidth, rectHeight);

                Font font = new Font("微軟正黑體", fontSize, FontStyle.Bold);   //定义字体  
                Brush whiteBrush = new SolidBrush(Color.White);   //白笔刷，画文字用  
                Brush blackBrush = new SolidBrush(Color.Transparent);   //透明笔刷，画背景用
                g.TextRenderingHint = TextRenderingHint.AntiAlias;//文字反鋸齒


                g.FillRectangle(blackBrush, rectX, rectY, rectWidth, rectHeight);

                RectangleF textArea_shadow = new RectangleF(Convert.ToSingle(image.Width * 0.022), Convert.ToSingle(image.Height * 0.022), rectWidth, rectHeight);//陰影用的矩形區域
                g.DrawString(text, font, new SolidBrush(Color.Black), textArea_shadow);//文字陰影

                g.DrawString(text, font, whiteBrush, textArea);


                bitmap.Save(Server.MapPath(fileName));
                //Byte2File(ms.ToArray(), Server.MapPath(fileName));

                g.Dispose();
                bitmap.Dispose();
                image.Dispose();
                ms.Dispose();


            }
            catch (Exception ex)
            {
                g.Dispose();
                bitmap.Dispose();
                image.Dispose();
                ms.Dispose();

                string exstring = ex.ToString();
            }

        }
        public byte[] ReadFile(string path)
        {

            byte[] data = null;

            FileStream fStream = null;

            try
            {
                fStream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite);
                data = new byte[(int)fStream.Length]; //設定 data 的長度
                fStream.Read(data, 0, data.Length); //將 fStream 資料讀到 data
            }
            catch (Exception ex)
            {

            }
            finally
            {
                fStream.Close();
                fStream.Dispose();
            }
            return data;

        }

        public bool Byte2File(byte[] bRead, string strNewFilePath)
        {

            FileStream fileStream = null;

            try
            {
                fileStream = new FileStream(strNewFilePath, FileMode.OpenOrCreate);
                fileStream.Write(bRead, 0, bRead.Length);
            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
                return false;
            }
            finally
            {
                fileStream.Close();
                fileStream.Dispose();
            }

            return true;
        }

    }
    public abstract class WebUserController : SourceController
    {
        protected int visitCount = 0;
        //protected Log.LogPlamInfo plamInfo = new Log.LogPlamInfo() { AllowWrite = true };
        //protected readonly string sessionShoppingString = "CestLaVie.Shopping";
        //protected readonly string sessionMemberLoginString = "CestLaVie.loginMail";
        private readonly string upload_path_tpl_o = "~/_Code/SysUpFiles/{0}.{1}/{2}/{3}/{4}";
        protected WebInfo wi;

        protected WebUserController()
        {
            ViewBag.NowHeadMenu = "";
        }
        protected override void Initialize(System.Web.Routing.RequestContext requestContext)
        {
            base.Initialize(requestContext);

            //plamInfo.BroswerInfo = System.Web.HttpContext.Current.Request.Browser.Browser + "." + System.Web.HttpContext.Current.Request.Browser.Version;
            //plamInfo.IP = System.Web.HttpContext.Current.Request.UserHostAddress;
            //plamInfo.UserId = 0;
            //plamInfo.UnitId = 0;

            Log.SetupBasePath = System.Web.HttpContext.Current.Server.MapPath("~\\_Code\\Log\\");
            Log.Enabled = true;

            try
            {
                var db = getDB0();

                var Async = db.SaveChangesAsync();
                Async.Wait();

                ViewBag.VisitCount = visitCount;
                ViewBag.IsFirstPage = false; //是否為首頁，請在首頁的Action此值設為True

                wi = new WebInfo();
            }
            catch (Exception ex)
            {
                Log.Write(ex.Message);
            }
        }
        /// <summary>
        /// 移除html tag
        /// </summary>
        /// <param name="htmlSource"></param>
        /// <returns></returns>
        public static string RemoveHTMLTag(string htmlSource)
        {
            //移除  javascript code.
            //htmlSource = Regex.Replace(htmlSource, @"<script[\d\D]*?>[\d\D]*?</script>", String.Empty);

            //移除html tag.
            htmlSource = Regex.Replace(htmlSource, @"<[^>]*>", String.Empty);
            return htmlSource;
        }
        public int getNewId()
        {
            return getNewId(ProcCore.Business.CodeTable.Base);
        }
        public int getNewId(ProcCore.Business.CodeTable tab)
        {
            using (var db = getDB0())
            {
                using (TransactionScope tx = new TransactionScope())
                {
                    try
                    {
                        String tab_name = Enum.GetName(typeof(ProcCore.Business.CodeTable), tab);
                        var items = from x in db.i_IDX where x.table_name == tab_name select x;

                        if (items.Count() == 0)
                        {
                            return 0;
                        }
                        else
                        {
                            var item = items.FirstOrDefault();
                            item.IDX++;
                            db.SaveChanges();
                            tx.Complete();
                            return item.IDX;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                        return 0;
                    }
                }
            }
        }
        private snObject getSN(ProcCore.Business.SNType tab)
        {

            snObject sn = new snObject();

            using (var db = getDB0())
            {
                using (TransactionScope tx = new TransactionScope())
                {
                    try
                    {
                        String tab_name = Enum.GetName(typeof(ProcCore.Business.SNType), tab);
                        var items = db.i_SN.Single(x => x.sn_type == tab_name);

                        if (items.y == DateTime.Now.Year &&
                            items.m == DateTime.Now.Month &&
                            items.d == DateTime.Now.Day
                            )
                        {
                            int now_max = items.sn_max;
                            now_max++;
                            items.sn_max = now_max;
                        }
                        else
                        {
                            items.y = DateTime.Now.Year;
                            items.m = DateTime.Now.Month;
                            items.d = DateTime.Now.Day;
                            items.sn_max = 1;
                        }

                        db.SaveChanges();
                        tx.Complete();

                        sn.y = items.y;
                        sn.m = items.m;
                        sn.d = items.d;
                        sn.sn_max = items.sn_max;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }
            return sn;
        }
        public string getOrderSN()
        {
            String tpl = "SN{0}{1:00}{2:00}-{3:00}{4:00}";
            snObject sn = getSN(ProcCore.Business.SNType.Orders);
            return String.Format(tpl, sn.y.ToString().Right(2), sn.m, sn.d, sn.sn_max, (new Random()).Next(99));
        }
        public FileResult downloadFile(int id, string category1, string category2, string file_name, string file_kind)
        {
            string SearchPath = String.Format(upload_path_tpl_o + "\\" + file_name, category1, category2, id, file_kind, "origin");
            string DownFilePath = Server.MapPath(SearchPath);

            FileInfo fi = null;
            if (System.IO.File.Exists(DownFilePath))
            {
                fi = new FileInfo(DownFilePath);
            }
            return File(DownFilePath, "application/" + fi.Extension.Replace(".", ""), Url.Encode(fi.Name));
        }
        public string imagePath(string category1, string category2, int id, string file_kind, string size_name)
        {
            string ImgSizeString = "s_" + size_name;
            string SearchPath = String.Format(upload_path_tpl_o, category1, category2, id, file_kind, ImgSizeString);
            string FolderPth = Server.MapPath(SearchPath);

            if (Directory.Exists(FolderPth))
            {
                string[] SFiles = Directory.GetFiles(FolderPth);

                if (SFiles.Length > 0)
                {
                    FileInfo f = new FileInfo(SFiles[0]);
                    return Url.Content(SearchPath) + "/" + f.Name;
                }
                else
                {
                    return Url.Content("~/Content/images/nopic.png");
                }

            }
            else
                return Url.Content("~/Content/images/nopic.png");
        }
        public FileResult AudioFile(string FilePath)
        {
            String S = Url.Content(FilePath);
            String DownFilePath = Server.MapPath(S);

            FileInfo fi = null;
            if (System.IO.File.Exists(DownFilePath))
                fi = new FileInfo(DownFilePath);

            return File(DownFilePath, "audio/mp3", Url.Encode(fi.Name));
        }
        public RedirectResult SetLanguage(string L, string A)
        {
            HttpCookie WebLang = new HttpCookie(DotWeb.CommSetup.CommWebSetup.WebCookiesId + ".Lang", L);
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(WebLang.Value);
            System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(WebLang.Value);
            ViewBag.Lang = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            Response.Cookies.Add(WebLang);
            return Redirect(Url.Action(A));
        }
        protected override string getRecMessage(string MsgId)
        {
            return Resources.Res.ResourceManager.GetString(MsgId);
        }
        public string GetImg(int id, string file_kind, string category1, string category2)
        {
            string tpl_path = "~/_Upload/" + category1 + "/" + category2 + "/" + id + "/" + file_kind;
            string img_folder = Server.MapPath(tpl_path);

            if (Directory.Exists(img_folder))
            {
                var get_files = Directory.EnumerateFiles(img_folder)
                    .Where(x => x.EndsWith("jpg") || x.EndsWith("jpeg") || x.EndsWith("png") || x.EndsWith("gif") || x.EndsWith("JPG") || x.EndsWith("JPEG") || x.EndsWith("PNG") || x.EndsWith("GIF"))
                    .FirstOrDefault();

                if (get_files != null)
                {
                    FileInfo file_info = new FileInfo(get_files);
                    return Url.Content(tpl_path + "\\" + file_info.Name);
                }
                else
                {
                    return null;//Url.Content("../../Content/images/no-pic.jpg");
                }
            }
            else
            {
                return null;//Url.Content("../../Content/images/no-pic.jpg");
            }
        }
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            Log.WriteToFile();
        }
    }
    #endregion

    #region 泛型控制器擴充

    public abstract class CtrlId<M, Q> : AdminController
        where M : new()
        where Q : QueryBase
    {
        protected AjaxGetData<M> r;
        protected M item;
        public abstract String aj_Init();
        public abstract String aj_MasterDel(Int32[] ids);
        public abstract String aj_MasterSearch(Q sh);
        public abstract String aj_MasterInsert(M md);
        public abstract String aj_MasterUpdate(M md);
        public abstract String aj_MasterGet(Int32 id);
    }
    public abstract class CtrlTId<M, Q> : AdminController
        where M : new()
        where Q : QueryBase
    {
        protected AjaxGetData<M> r;
        protected M item;
        public abstract String aj_Init();
        public abstract Task<string> aj_MasterDel(Int32[] ids);
        public abstract string aj_MasterSearch(Q sh);
        public abstract Task<string> aj_MasterInsert(M md);
        public abstract Task<string> aj_MasterUpdate(M md);
        public abstract Task<string> aj_MasterGet(Int32 id);
    }

    public abstract class CtrlSN<M, Q> : AdminController
        where M : new()
        where Q : QueryBase
    {
        protected AjaxGetData<M> r;
        protected M item;
        public abstract String aj_Init();
        public abstract String aj_MasterDel(string[] sns);
        public abstract String aj_MasterSearch(Q sh);
        public abstract String aj_MasterInsert(M md);
        public abstract String aj_MasterUpdate(M md);
        public abstract String aj_MasterGet(string sn);
    }

    public abstract class CtrlTSN<M, Q> : AdminController
        where M : new()
        where Q : QueryBase
    {
        protected AjaxGetData<M> r;
        protected M item;
        public abstract string aj_Init();
        public abstract Task<string> aj_MasterDel(string[] sns);
        public abstract string aj_MasterSearch(Q sh);
        public abstract Task<string> aj_MasterInsert(M md);
        public abstract Task<string> aj_MasterUpdate(M md);
        public abstract Task<string> aj_MasterGet(string sn);
    }

    public abstract class CtrlIdId<M, Q, Ms, Qs> : CtrlId<M, Q>
        where M : new()
        where Q : QueryBase
        where Ms : new()
        where Qs : QueryBase
    {
        protected Ms item_sub;
        protected IEnumerable<Ms> items_sub;

        protected AjaxGetData<Ms> rd;
        public abstract string aj_DetailGet(Int32 DetailId);
        public abstract string aj_DetailSearchBySN(String MasterSerial);
        public abstract string aj_DetailInsert(Ms md);
        public abstract string aj_DetailUpdate(Ms md);
        public abstract string aj_DetailDelete(Int32[] ids);
    }

    public abstract class CtrlIdSN<M, Q, Ms, Qs> : CtrlId<M, Q>
        where M : new()
        where Q : QueryBase
        where Ms : new()
        where Qs : QueryBase
    {
        protected Ms item_sub;
        protected IEnumerable<Ms> items_sub;

        protected AjaxGetData<Ms> rd;
        public abstract string aj_DetailGet(Int32 DetailId);
        public abstract string aj_DetailSearchBySN(String MasterSerial);
        public abstract string aj_DetailInsert(Ms md);
        public abstract string aj_DetailUpdate(Ms md);
        public abstract string aj_DetailDelete(Int32[] ids);
    }

    public abstract class CtrlSNSN<M, Q, Ms, Qs> : CtrlSN<M, Q>
        where M : new()
        where Q : QueryBase
        where Ms : new()
        where Qs : QueryBase
    {
        protected Ms item_sub;
        protected IEnumerable<Ms> items_sub;

        protected AjaxGetData<Ms> rd;
        public abstract string aj_DetailGet(Int32 DetailId);
        public abstract string aj_DetailSearchBySN(String MasterSerial);
        public abstract string aj_DetailInsert(Ms md);
        public abstract string aj_DetailUpdate(Ms md);
        public abstract string aj_DetailDelete(int id);
    }


    public abstract class CtrlTSNTSN<M, Q, Ms, Qs> : CtrlTSN<M, Q>
        where M : new()
        where Q : QueryBase
        where Ms : new()
        where Qs : QueryBase
    {
        protected Ms item_sub;
        protected IEnumerable<Ms> items_sub;

        protected AjaxGetData<Ms> rd;
        public abstract Task<string> aj_DetailGet(Int32 DetailId);
        public abstract Task<string> aj_DetailSearchBySN(String MasterSerial);
        public abstract Task<string> aj_DetailInsert(Ms md);
        public abstract Task<string> aj_DetailUpdate(Ms md);
        public abstract Task<string> aj_DetailDelete(int id);
    }

    #endregion
    public class DocInfo
    {
        public String Name { get; set; }
        public int Sort { get; set; }
        public String Momo { get; set; }
        public String Link { get; set; }
    }
    public class AjaxGetData<T> : ResultInfo
    {
        public T data { get; set; }
        public bool hasData { get; set; }
    }
    public class AjaxGetItems<T> : ResultInfo
    {
        //有大問題
        public object data { get; set; }
    }
    public class Options
    {
        public String value { get; set; }
        public String label { get; set; }
    }
    public class ReportData
    {
        public string ReportName { get; set; }
        public object[] Parms { get; set; }
        public object[] Data { get; set; }
    }
    public class PageImgShow
    {

        public string icon_path { get; set; }
        public string link_path { get; set; }
    }
    public class JsonFileInfo
    {
        public string fileName { get; set; }
        public int sort { get; set; }
    }
    public class WebInfo
    {
        public IList<News> News { get; set; }
        public IList<Banner> Banner { get; set; }
        //public IList<活動花絮主檔> Active { get; set; }
        //public IList<文件管理> Document { get; set; }
    }
    public class BannerInfo
    {
        public IList<Banner> photo { get; set; }
        public IList<Banner> video { get; set; }
        //public IList<活動花絮主檔> Active { get; set; }
        //public IList<文件管理> Document { get; set; }
    }
}