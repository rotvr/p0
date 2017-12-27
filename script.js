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
loading.show(true);
