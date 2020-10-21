import React from "react";

export default class WebServicesManager extends React.Component {
  baseUrl = "http://localhost:8080/";

  //Post method

  callPostMethod(apiURL, params, callback) {
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    fetch(apiURL, {
      method: "POST",
      headers: headeris,
      body: params.dataToInsert
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {
         console.log(error.message);
      });
  }
  postApiCall(params, callback) {
    return this.callPostMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get method
  callGetMethod(baseURL, params, callback) {
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {console.log(error)});
  }
  
  getApiCall(params, callback) {
    return this.callGetMethod(this.baseUrl + params.endPoint, params, callback);
  }

  //Get method for contactUs
  callGetMethodForContactUs(baseURL, params, callback) {
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        window.alert("Error");
      });
  }
  getApiCallForContactUs(params, callback) {
    return this.callGetMethodForContactUs(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get method for Email validate Check
  callGetMethodForEmailValidate(baseURL, params, callback) {
    baseURL = baseURL + "/?email=" + params.dataToCheck;
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {
        window.alert(error);
      });
  }
  getApiCallForEmail(params, callback) {
    return this.callGetMethodForEmailValidate(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }


  callGetMethodForFilter(baseURL,params,callback){
    console.log("BaseUrl", baseURL);
   fetch(baseURL, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      "Authorization":"Bearer "+params.dataToInsert.Token,
    }
  })
    .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {
        window.alert(error);
      });
  }


  getApiCallForFilter(params,callback){
    console.log("datatoinsert",params.dataToInsert.Lat);
    return this.callGetMethodForFilter(
      this.baseUrl + params.endPoint+"/?lat="+params.dataToInsert.Lat+"&log="+params.dataToInsert.Long+"&radius="+params.dataToInsert.Radius+"&gearbox="+params.dataToInsert.GearBox+"&gender="+params.dataToInsert.Gender+"&role="+params.dataToInsert.Role,
      params,
      callback
    )
  }

  //Post method
  callPostMethodToGetAllPerson(baseURL, params, callback) {
    fetch(baseURL, {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        window.alert("Error");
      });
  }
  callPostToGetAllPerson(params, callback) {
    return this.callPostMethodToGetAllPerson(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  callPostNearbyInstructorMethod(apiURL, params, callback) {
    fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+params.token

      },
      body: params.dataToInsert
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {});
  }
  

  postApiNearbyInstructorsCall(params, callback) {
    return this.callPostNearbyInstructorMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get with parameters method with ID
  callGetWithParamMethod(baseURL, params, callback) {
    // debugger
    baseURL = baseURL + "/?id=" + params.dataToFetch;
    fetch(baseURL, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+params.token
      }
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }
  callGetApiForgotPassword(baseURL, params, callback) {
    // debugger;
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    baseURL = `${baseURL}/?email=${params.dataToFetch.email}&id=${params.dataToFetch.id}`;
     fetch(baseURL, {
      method: "Get",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }
  callApiwithParamReturnMsg(baseURL, params, callback) {
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    baseURL = baseURL + "/?id=" + params.dataToFetch;
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log("Json Form of response", responseJson);
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {});
  }

  GetBookletCmt(baseURL, params, callback) {
    baseURL = this.baseUrl +baseURL+ "/?studentId=" + params[0]+"&bookletItemId="+params[1];
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params[2] !== undefined){headeris["Authorization"]="Bearer "+params[2]}
    fetch(baseURL, {
      method: "Get",
      headers:headeris,
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }
  getApiWithParamCall(params, callback) {
    return this.callGetWithParamMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  getApiForForgotPassword(params, callback) {
    return this.callGetApiForgotPassword(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
getApiwithParamReturnMsg(params, callback) {
  return this.callApiwithParamReturnMsg(
    this.baseUrl + params.endPoint,
    params,
    callback
  );
}
  //Get LogIn
  callGetLogIn(baseURL, params, callback) {
    // debugger;
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    fetch(baseURL, {
      method: "POST",
      headers: headeris,
      body: params.dataToLogIn
    })
      .then(response => response.json())
      .then(responseJson => {
        // debugger;
        let statusCode = responseJson.code;
        callback(statusCode, responseJson);
      })
      .catch(error => {alert(error)});
  }

  LogIn(params, callback) {
    return this.callGetLogIn(this.baseUrl + params.endPoint, params, callback);
  }

  //Update method

  //Get with parameters method with ID
  callPutMethod(baseURL, params, callback) {
    // var params2 = JSON.parse(params.dataToUpdate);
    debugger;
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    if(params.userID){
      baseURL = baseURL+"/"+params.userID;
    }

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "PUT",
      headers: headeris,
      body: params.dataToUpdate
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {});
  }

  putApi(params, callback) {
    return this.callPutMethod(this.baseUrl + params.endPoint, params, callback);
  }

  //`delete` with parameters method with ID
  callDeleteMethod(baseURL, params, callback) {
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    var params1 = JSON.parse(params.dataToUpdate);
    baseURL = baseURL + "?id=" + params1.id;

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Post",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        window.alert("Error");
      });
  }

  DeleteApi(params, callback) {
    return this.callDeleteMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //delete with Id in url
  callDeleteMethodInURL(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToDelete);
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    baseURL = baseURL + "/" + params.dataToDelete;

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Delete",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.returnStatus);
      })
      .catch(error => {
        window.alert("Error",error);
      });
  }

  DeleteApiInURL(params, callback) {
    return this.callDeleteMethodInURL(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get with parameters method with ID
  callPostMethodForSuspend(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToUpdate);

    // baseURL = baseURL;
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}
    fetch(baseURL, {
      method: "Post",
      headers: headeris,
      body: params.dataToUpdate
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        window.alert("Error");
      });
  }
  callPostMethodUpdatePassword(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToUpdate);
    let headeris = {
        "Content-Type": "application/json"
      }
    if(params.token !== undefined){headeris["Authorization"]="Bearer "+params.token}

    baseURL = `${baseURL}/?id=${params.id}&password=${params.password}`;
    fetch(baseURL, {
      method: "Post",
      headers: headeris,
      body: params.dataToUpdate
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.data);
      })
      .catch(error => {
        window.alert("Error");
      });
  }

  postMethodForSuspend(params, callback) {
    return this.callPostMethodForSuspend(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
  postMethodForUpdatePassword(params, callback) {
    return this.callPostMethodForSuspend(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Image Post Method
  callImagePostMethod(apiURL, params, callback) {
    fetch(apiURL, {
      method: "POST",
      body: params.dataToInsert
    })
      .then(response => response.json())
      .then(responseJson => {
        let statusCode = responseJson.code;
        callback(statusCode, responseJson.message);
      })
      .catch(error => {});
  }

  postApiImageCall(params, callback) {
    return this.callImagePostMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
}