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
    public class Product_Category_L2Controller : BaseApiController
    {
        public IEnumerable<categoryL2> GetProductL2Category(int mainId)
        {

            db0 = openLogic().getDB0;
            var items = db0.Product_Category_L2.Where(x => x.i_Hide == false && x.product_category_l1_id==mainId).Select(x => new categoryL2
            {
                id = x.product_category_l2_id,
                name = x.category_l2_name,
                sort = x.sort
            }).OrderBy(x => x.sort).ToList();
            db0.Dispose();
            return items;
        }
        public class categoryL2 {
            public int id { get; set; }
            public string name { get; set; }
            public int sort { get; set; }
        }
    }
}
