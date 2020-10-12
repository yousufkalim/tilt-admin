export default class Utilities {
    static checkAPICallStatus(statusCode) {
      if (statusCode === 200) return true;
      else return false;
    }
    static getErrorString(errorJSON) {
      var strError = errorJSON;
  
      return strError;
    }
  
    static ValidateEmail(mail) {
      // if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\w{2,3})+$/.test(mail)) {
      if (/[a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@+(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(mail)) {
        return true;
      }
      return false;
    }
    static ValidatePassword(password) {
      if (
        /^(?=.*\d).{8,}$/.test(password)
      ) {
        return true;
      }
      return false;
    }
  
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/.test(password)
  
    static ValidateCellNo(cell) {
      if (/^(?:0\,\+)?[0-9\s]*$/.test(cell) && cell !== "") {
        return true;
      }
      return false;
    }
  
    static checkNull(value) {
      return value === null || value === "null" ? "" : value;
    }
  
    static isValidString(strValue) {
      var blnResult = false;
      if (strValue !== undefined) {
        if (typeof strValue === "string") {
          if (strValue.trim() !== "") {
            blnResult = true;
          }
        }
      }
      return blnResult;
    }
  
    static isValidCNIC(strValue) {
      if (/^3([\d]{4})-[(\D\s)]?[\d]{7}-[(\D\s)]?[\d]{1}$/.test(strValue)) {
        return true;
      }
      return false;
    }
    // static isValidString(strValue) {
    //   var blnResult = false;
    //   if (strValue != undefined) {
    //     if (typeof strValue === "string") {
    //       if (strValue.trim() != "") {
    //         blnResult = true;
    //       }
    //     }
    //   }
    //   return blnResult;
    // }
  
    static removeTimesNewRomanFont(strValue) {
      if (strValue !== undefined) {
        //"<span style="font-size:12pt;line-height:107%;font-family:'Times New Roman', serif;">Rough endoplasmic reticulum</span>"
        strValue = strValue.replace("font-family:'Times New Roman', serif", "");
        strValue = strValue.replace("font-family:", "");
        strValue = strValue.replace("line-height:", "");
  
        var str = "";
  
        while (str !== strValue) {
          str = strValue.replace("font-family:", "");
  
          if (str === strValue) {
            break;
          } else {
            strValue = str.replace("font-family:", "");
          }
        }
  
        strValue = str;
      }
      return strValue;
    }
  
    static showAlert(msg) {
      alert(msg);
    }
  }