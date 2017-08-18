// BOILERPLATE FOR PAUL HUMPHREY .js FILES

// "FRONT END" JAVASCRIPT:

// BEGIN jQuery...
$(document).ready(function(){

    // 2. set up function to "nuke and rebuild" the todo list
    var render = function(){
        $('#todo-list').empty()
        for (var i = 0; i < toDoList.length; i++ ) {
            var cssClass = ''
            // when rendering, check if todo item is done and display as such
            if (toDoList[i].done){
                cssClass='class="line-through"'
            }
            $('#todo-list').append(`
                <li ${cssClass}>${toDoList[i]['todo-item']}</li>
                <button type="button" class="btn btn-danger btn-xs delete-item">Danger</button>
            `)
        }
    }

    // 5. process the todo list changes and re-render them...
    var getFreshData = function(){
        $.get('/todo', function(data){
            console.log(data)
            toDoList = data
            render()
        })
    }

    // set up array to hold our list items
    var toDoList = []
    // whenever page reloads, nuke & rebuild the todo list via the getFreshData function...
    getFreshData()

    // 3. when something is typed into the todo list form and the button is clicked...
    $('#new-todo-form').on('submit', function(event){
        event.preventDefault()

        // in a jQuery event handler, `this` refers to the element that fired the event
        console.log($( this ).serialize())

        // receive the data typed into the form, send this to the server, and refresh form to receive more data...  "serialize" transforms the data
        $.post('/todo', $(this).serialize(), function(data){
            console.log(data)
            getFreshData()
        })
    })

    // 6. when a list item's text is clicked, change the appearance to strikethrough
    // when the page body is loaded (i.e. every refresh), the li's are created, and now can be targeted in the body...
    $('body').on('click', '#todo-list li', function(event){
        event.preventDefault()
        console.log('todo-list li clicked');
        console.log(event);
        // when list item is clicked, change its appearance to line-through
        $( this ).toggleClass("line-through");
        var done = $( this ).hasClass("line-through");
        $.post('/todo/done', {text: event.target.innerText, done: done}, function(data){
            console.log(data)
            getFreshData()
        })
    })

    $('#todo-list').on('click', '.delete-item', function(event){
        event.preventDefault()
        console.log('delete-item clicked');
        console.log(event);
        // when list item is clicked, change its appearance to line-through
        // $( this ).toggleClass("line-through");
        var done = $( this ).hasClass("line-through");
        $.post('/todo/delete', {item: event.currentTarget.li}, function(data){
            console.log(data)
            getFreshData()
        })
    })





















// END jQuery...
})
