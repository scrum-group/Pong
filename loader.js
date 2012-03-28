/**
 * @author http://stackoverflow.com/users/40667/waynem
 */

/**
* @fileoverview This file stores global functions that are required by other libraries.
*/

if (typeof(jQuery) === 'undefined') {
    throw 'jQuery is required.';
}

/** Defines the base script directory that all .js files are assumed to be organized under. */
var BASE_DIR = 'js/';

/**
* Loads the specified file, outputting it to the <head> HTMLElement.
*
* This method mimics the use of using in C# or import in Java, allowing
* JavaScript files to "load" other JavaScript files that they depend on
* using a familiar syntax.
*
* This method assumes all scripts are under a directory at the root and will
* append the .js file extension automatically.
*
* @param {string} file A file path to load using C#/Java "dot" syntax.
* 
* Example Usage:
* imports('core.utils.extensions'); 
* This will output: <script type="text/javascript" src="/js/core/utils/extensions.js"></script>
*/
var Loader = function(){
    //This is constructor function
    
    //Private
    var private_var = null;
    function private_function(){}
        
    //Privileged
    this.privileged_function = function(){ 
      private_var = 1;
    };
    
    /**
     * @usage This function is returning an cloned instance of it self.
     * @return New copy of his class.
     */
    this.replicate = function(){
      function newClass(){}
      newClass.prototype = this;
      return new newClass();  
    };
  }
  
  //Public
  Loader.prototype.method_name = function(first_argument) {

};
function include(file) {
    var fileName = file.substr(file.lastIndexOf('.') + 1, file.length);

    // convert PascalCase name to underscore_separated_name
    var regex = new RegExp(/([A-Z])/g);
    if (regex.test(fileName)) {
        var separated = fileName.replace(regex, ",$1").replace(',', '');
        fileName = separated.replace(/[,]/g, '_');
    }

    // remove the original js file name to replace with underscore version
    file = file.substr(0, file.lastIndexOf('.'));

    // convert the dot syntax to directory syntax to actually load the file
    if (file.indexOf('.') > 0) {
        file = file.replace(/[.]/g, '/');
    }

    var src = BASE_DIR + file + '/' + fileName.toLowerCase() + '.js';
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    document.getElementsByTagName("head")[0].appendChild(script);
}