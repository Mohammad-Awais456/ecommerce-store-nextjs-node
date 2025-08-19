import { productModel } from "../Database/models.js";

export class apiFeatures
{
    constructor(query,query_str)
    {
        this.query = query;
        this.query_str = query_str ;
        // Assigning Total Product Count
        productModel.countDocuments().then(d=>this.totalProducts = d);

        console.log(query_str,"this is raw query string\n\n");
        // Adjustment in the query string for keywords
        if(this.query_str.keyword) 
            {
                
                this.query_str.keyword = this.query_str.keyword.split(" ").filter(Boolean).join('|');
                
            }
            // Adjustment in query strin for category filtering
        if(this.query_str.categories) 
            {
                
                this.query_str.categories = this.query_str.categories.split(",");
                this.query_str ={...this.query_str,categories:{$in:this.query_str.categories}};
            }
        // Adjustment in query strin for price filtering
        if(this.query_str.price) 
            {
                // copying the price object
                const tempPriceObject = {...this.query_str.price}; 

                let new_Price_object={};

                for(const keyNames in tempPriceObject)
                    {
                        if (tempPriceObject.hasOwnProperty(keyNames))
                            {
                               const newKeyName = `$${keyNames}`; // creating new names
                               
                               new_Price_object[newKeyName] = tempPriceObject[keyNames];
                            }
                        }

                this.query_str.price = new_Price_object; 
            }

    }
    print(){
       console.log(this.query,this.query_str);
    }
  search() {
  const keyword = this.query_str.keyword
    ? {
        $or: [
          {
            name: {
              $regex: `(${this.query_str.keyword})`, // no \b
              $options: "i"
            }
          },
          {
            description: {
              $regex: `(${this.query_str.keyword})`,
              $options: "i"
            }
          }
        ]
      }
    : {};

  this.query = this.query.find(keyword);
  return this;
}

    // search filtering 
     filter()
    {
        const copy_quer = {...this.query_str};
        const removeFields = ["keyword","page","limit"];
        removeFields.forEach(key=>delete copy_quer[key]);

        console.log(this.copy_quer);
      
 
        this.query =  this.query.find({...copy_quer});
        return  this;
    }
    // Pagination 
    pagination(resultPerPage)
    {
        const current_page = this.query_str.page;
        const product_skip_ratio = resultPerPage *  (current_page-1);
        this.query = this.query.limit(resultPerPage).skip(product_skip_ratio);

       return this;
    }
}