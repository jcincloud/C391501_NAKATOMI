using DotWeb.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ProcCore.Business;
using ProcCore.Business.DB0;

namespace DotWeb.ApiControllers
{
    [Authorize]
    public class Product_Category_L1Controller : BaseApiController
    {
        public IEnumerable<categoryL1> GetProductL1Category()
        {

            db0 = openLogic().getDB0;
            var items = db0.Product_Category_L1.Where(x => x.i_Hide == false).Select(x => new categoryL1
            {
                id = x.product_category_l1_id,
                name = x.category_l1_name,
                sort = x.sort
            }).OrderBy(x => x.sort).ToList();
            db0.Dispose();
            return items;
        }
        public string GetProductL1Category(int id)
        {
            return "value";
        }
        public IEnumerable<m_Product_Category_L1> GetProducts(string name,string value)
        {

            db0 = openLogic().getDB0;
            var items = db0.Product_Category_L1.Where(x => x.i_Hide == false).Select(x => new m_Product_Category_L1
            {
                product_category_l1_id = x.product_category_l1_id,
                category_l1_name = x.category_l1_name,
                sort = x.sort
            }).OrderBy(x => x.sort).ToList();
            db0.Dispose();
            return items;
        }
        public string Post([FromBody]string value)
        {
            return "OK";
        }
        public void Put(int id, [FromBody]string value)
        {
        }
        public void Delete(int id)
        {
        }

        public class q_Category
        {
            public string category_name { get; set; }
        }

        public class categoryL1 {
            public int id { get; set; }
            public string name { get; set; }
            public int sort { get; set; }
        }
    }
}
