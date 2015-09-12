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
    public class ProductController : BaseApiController
    {
        public IEnumerable<product> GetProductByCategoryL2(int subId)
        {

            db0 = openLogic().getDB0;
            var items = db0.Product.Where(x => x.i_Hide == false).Select(x => new product
            {
                id = x.product_id,
                name = x.product_name,
                sort = x.sort
            }).OrderBy(x => x.sort).ToList();
            db0.Dispose();
            return items;
        }
        public class product
        {
            public int id { get; set; }
            public string name { get; set; }
            public int sort { get; set; }
        }
    }
}
