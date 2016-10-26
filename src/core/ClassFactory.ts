

export class ClassFactory
{


    generator:new()=>any;

    properties:any;
    
    constructor(generator:any) {
        this.generator = generator;
    }

    newInstance():any
    {
        var instance:Object = new this.generator();
        
        if (this.properties != null)
        {
            for (var p in this.properties)
            {
                instance[p] = this.properties[p];
            }
        }
        
        return instance;
    }
}