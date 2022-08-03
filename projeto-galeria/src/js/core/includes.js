import $ from 'jquery'

const loadHtmlSuccessCallBacks = []

export function onLoadHtmlSuccess(callback){
    if(!loadHtmlSuccessCallBacks.includes(callback)){
        loadHtmlSuccessCallBacks.push(callback)
    }
}

function loadIncludes(parent){
    if(!parent) parent = 'body'
    $(parent).find('[wm-include]').each(function(i,e) {
        const url = $(e).attr('wm-include')
        $.ajax({
            url,
            success(data){
                $(e).html(data)
                $(e).removeAttr('wm-include')

                loadHtmlSuccessCallBacks.forEach(callback => callback(data))
                loadIncludes(e)
            }
        })
    })
}

loadIncludes()