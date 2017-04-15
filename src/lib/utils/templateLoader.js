
class TemplateLoader {

    static _getNodeFromDom(templateObj,componentName){
        if (!templateObj.value) {
            console.error(`can not process template at component ${componentName}`);
            throw "template.value must be specified";
        }
        let node = document.getElementById(templateObj.value);
        if (!node) throw `can not fing dom element with id ${templateObj.value}`;
        return node;
    }

    static _getNodeFromString(templateObj,componentName){
        if (!templateObj.value) throw "template string not provided";
        if (typeof templateObj.value!=='string') {
            console.error(`can not process template at component ${componentName}`);
            throw `template.value mast be a String, but ${typeof templateObj.value} found`;
        }
        let container = document.createElement('div');
        container.innerHTML = templateObj.value;
        return container;
    }

    static getNode(properties = {},componentName){
        let templateObj = properties.template;
        if (!templateObj) throw `template object not defined. Provide template at your component '${componentName}'`;
        switch (templateObj.type) {
            case 'dom':
                return TemplateLoader._getNodeFromDom(templateObj,componentName);
            case 'string':
                return TemplateLoader._getNodeFromString(templateObj,componentName);
            default:
                console.error(`can not process template at component ${componentName}`);
                throw `can not load template with type ${templateObj.type}, only "dom" and "string" types is supported`;
        }
    }

}