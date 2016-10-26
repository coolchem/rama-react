

export class Dictionary<K,V>
{
    private dictionaryArray = [];

    get(key:K):V
    {

        var item = this.getKeyItem(key);
        if(item !== undefined)
        {
            return item.value;
        }

        return null;

    }

    set(key:K, value:V):void
    {

        var item = this.getKeyItem(key);
        if(item !== undefined)
        {
            item.value = value;
        }
        else
        {
            this.dictionaryArray.push({key:key, value:value});
        }

    }

    remove(key:K,value:V):void
    {
        for(var i = 0; i<this.dictionaryArray.length; i++)
        {
            var item = this.dictionaryArray[i];
            if(item.key === key)
            {
                this.dictionaryArray.splice(i, 1);
                break;
            }
        }
    }

    hasKey(key:K):boolean
    {
        var item = this.getKeyItem(key);
        return item !== undefined
    }

    private getKeyItem(key){

        for(var i = 0; i<this.dictionaryArray.length; i++)
        {
            var item = this.dictionaryArray[i];
            if(item.key === key)
            {
                return item;
            }
        }

    }
}