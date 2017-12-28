moment.locale('pt');

var loading = {
    div: document.getElementById('loading_overlay'),
    show: function(initial_loading){
        this.div.style.display = 'block';
        setTimeout(function(){ 
            loading.div.style.opacity = '1'; 
            if(initial_loading){ loading.hide(); }
        }, 100);
    },
    hide: function(){
        this.div.style.opacity = '0';
        setTimeout(function(){ loading.div.style.display = 'none'; }, 500);
    }
}

var p0 = {
    api_url: 'https://www.publico.pt/api/list/ultimas',
    proxy: 'http://cors-proxy.htmldriven.com/?url=', 
    last_update: false, 
    model: false,
    format: function(json){
        var model = json.map(function(m){
            return {
                id: m.id,
                date: m.data,
                title: m.titulo,
                description: m.descricao,
                text: m.texto.replace(/(<\/?(?:p)[^>]*>)|<[^>]+>/ig, '$1'),
                url: m.shareUrl,
            }
        });
        return model;
    },
    save: function(model){
        window.localStorage.setItem('p0_model', JSON.stringify(model));
    },
    load: function(){
        var storage = window.localStorage.getItem('p0_model');
        if(storage){
            this.model = JSON.parse(storage);
            return this.model;
        }else{ return false; }
    },
    initialize: function(){
        loading.show();
        var storage = this.load();
        if(storage){
            this.model = storage;
            loading.hide();
            return true;
        }
        if(!window.fetch){ alert('Esta aplicação não é compatível com o seu browser.'); return false; }
        fetch(this.proxy + this.api_url, {method:'get', cache:'no-cache'}).then(function(response){
            if(!response.ok){ return false; }
            return response.json();
        }).then(function(json){
            loading.hide();
            p0.model = p0.format(JSON.parse(json.body));
            p0.save(p0.model);
            return true;
        }).catch(function(error){
            console.log(error);
            return false;
        });
    },
    share: function(index){
        var article = this.model[index];
        if(!navigator || !navigator.share){
            alert('Esta aplicação não é compatível com o seu browser.'); return false; 
        }
        navigator.share({
            title: article.title,
            text: article.description,
            url: article.url
        }); 
    }
}
p0.initialize();


