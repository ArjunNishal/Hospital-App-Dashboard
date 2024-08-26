import React from "react";

const Breadcrumb = ({ backpage, currentpage, backurl, maintab, heading }) => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="float-end">
            <ol className="breadcrumb">
              {/* maintab */}
              {/* <li className="breadcrumb-item">
                <a href="#">metrica</a>
              </li> */}
              {/* backpage backurl */}
              <li className="breadcrumb-item">
                <a href="#">{backpage}</a>
              </li>
              {/* currentpage */}
              <li className="breadcrumb-item active">{currentpage}</li>
            </ol>
          </div>
          {/* currentpage heading */}
          <h4 className="page-title">{heading}</h4>
        </div>
        {/*end page-title-box*/}
      </div>
      {/*end col*/}
    </div>
  );
};

export default Breadcrumb;
