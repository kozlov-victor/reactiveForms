
class TemplateLoader {

    static _getNodeFromDom(templateObj){
        if (!templateObj.value) throw "template.value must be specified";
        let node = document.getElementById(templateObj.value);
        if (!node) throw `can not fing dom element with id ${templateObj.value}`;
        return node;
    }

    static _getNodeFromString(templateObj){
        if (!templateObj.value) throw "template string not provided";
        if (typeof templateObj.value!=='string')
            throw `template.value mast be a String, but ${typeof templateObj.value} found`;
        let container = document.createElement('div');
        container.innerHTML = templateObj.value;
        return container;
    }

    static getNode(templateObj){
        if (!templateObj) throw "template object not defined. Provide template at your component";
        switch (templateObj.type) {
            case 'dom':
                return TemplateLoader._getNodeFromDom(templateObj);
            case 'string':
                return TemplateLoader._getNodeFromString(templateObj);
            default:
                throw `can not load template with type ${templateObj.type}, only "dom" and "string" types is supported`;
        }
    }

}