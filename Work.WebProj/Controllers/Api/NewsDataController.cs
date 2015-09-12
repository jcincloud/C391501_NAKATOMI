using DotWeb.Helpers;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.WebCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace DotWeb.Api
{
    public class NewsDataController : ajaxApi<News, q_NewsData>
    {
        public async Task<IHttpActionResult> Get(int id)
        {
            using (db0 = getDB0())
            {
                item = await db0.News.FindAsync(id);
                r = new AjaxGetData<News>() { data = item };
            }

            return Ok(r);
        }
        public IHttpActionResult Get([FromUri]q_NewsData q)
        {
            #region 連接BusinessLogicLibary資料庫並取得資料

            using (db0 = getDB0())
            {
                var items = (from x in db0.News
                             join y in db0.i_Lang on x.i_Lang equals y.lang
                             orderby x.sort descending
                             select new m_News()
                             {
                                 news_id = x.news_id,
                                 title = x.title,
                                 sort = x.sort,
                                 is_interval = x.is_interval,
                                 start_day = x.start_day,
                                 end_day = x.end_day,
                                 introduction = x.introduction,
                                 i_Hide = x.i_Hide,
                                 i_Lang = x.i_Lang,
                                 lang_memo=y.area
                             });

                

                if (q.title != null)
                {
                    items = items.Where(x => x.title.Contains(q.title));
                }
                if (q.i_Lang != null)
                {
                    items = items.Where(x => x.i_Lang == q.i_Lang);
                }
                if (q.lang_sort != null)
                {
                    if (q.lang_sort == "asc")
                        items = items.OrderBy(x => x.i_Lang);
                    if (q.lang_sort == "desc")
                        items = items.OrderByDescending(x => x.i_Lang);
                }

                int page = (q.page == null ? 1 : (int)q.page);
                int startRecord = PageCount.PageInfo(page, this.defPageSize, items.Count());

                var resultItems = items.Skip(startRecord).Take(this.defPageSize).ToList();

                return Ok(new GridInfo<m_News>()
                {
                    rows = resultItems,
                    total = PageCount.TotalPage,
                    page = PageCount.Page,
                    records = PageCount.RecordCount,
                    startcount = PageCount.StartCount,
                    endcount = PageCount.EndCount
                });
            }
            #endregion
        }
        public async Task<IHttpActionResult> Put([FromBody]News md)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                item = await db0.News.FindAsync(md.news_id);

                item.sort = md.sort;
                item.title = md.title;
                item.start_day = md.start_day;
                item.is_interval = md.is_interval;
                if (md.is_interval)
                    item.end_day = md.end_day;
                item.introduction = md.introduction;
                item.i_Hide = md.i_Hide;
                item.i_Lang = md.i_Lang;

                item.i_UpdateDateTime = DateTime.Now;

                await db0.SaveChangesAsync();
                rAjaxResult.result = true;
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.ToString();
            }
            finally
            {
                db0.Dispose();
            }
            return Ok(rAjaxResult);
        }
        public async Task<IHttpActionResult> Post([FromBody]News md)
        {
            md.news_id = GetNewId(ProcCore.Business.CodeTable.News);
            ResultInfo rAjaxResult = new ResultInfo();
            if (!ModelState.IsValid)
            {
                rAjaxResult.message = ModelStateErrorPack();
                rAjaxResult.result = false;
                return Ok(rAjaxResult);
            }

            try
            {
                #region working a
                db0 = getDB0();
                md.i_InsertDateTime = DateTime.Now;
                db0.News.Add(md);
                await db0.SaveChangesAsync();

                rAjaxResult.result = true;
                rAjaxResult.id = md.news_id;
                return Ok(rAjaxResult);
                #endregion
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
                return Ok(rAjaxResult);
            }
            finally
            {
                db0.Dispose();
            }
        }
        public async Task<IHttpActionResult> Delete([FromUri]int[] ids)
        {
            ResultInfo rAjaxResult = new ResultInfo();
            try
            {
                db0 = getDB0();

                foreach (var id in ids)
                {
                    item = new News() { news_id = id };
                    db0.News.Attach(item);
                    db0.News.Remove(item);
                }

                await db0.SaveChangesAsync();

                rAjaxResult.result = true;
                return Ok(rAjaxResult);
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
                return Ok(rAjaxResult);
            }
            finally
            {
                db0.Dispose();
            }
        }
    }
}
