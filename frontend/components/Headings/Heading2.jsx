// import React from 'react'

function Heading2({title1,title2,para,id}) {
  return (
    <div className={`heading-2 ${id?id:""}`}>
    <div className="wrapper">            
    <h2 className="title h2 upper"><span className="h2 upper">{title2}</span> {title1} </h2>
    {para?
    <p className="text para">{para}</p>
    :""
    
}
    </div>
  </div>
  )
}

export default Heading2