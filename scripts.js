// Variáveis

// Enviar processo para adicionar li na ul, com a descrição prévia...

const inputTask = document.querySelector('#add--input')
const formMain = document.querySelector('#main--form')
const taskList = document.querySelector('#tasks--list')
let message = document.querySelector('#message')
const lis = taskList.getElementsByTagName('li')

let taskStorage = getSavedData()

function getSavedData(){
    let taskData =  localStorage.getItem('tasksData')
    taskData = JSON.parse(taskData)
    return taskData && taskData.length ? taskData : [] // Precisa da verificação se o dado existe ou se ele tem conteúdo, caso o usuário limpe não de erro no código
}

function setSavedData(){
    localStorage.setItem('tasksData', JSON.stringify(taskStorage))
    renderTask()
}

setSavedData()

formMain.addEventListener('submit', function(e){

    e.preventDefault()
    addtask(inputTask.value)
    renderTask()
    inputTask.value = ''
    setSavedData()

})

function addtask(t){
   
    taskStorage.push(
        {
            description : t,
            completed : false
        }
    )

    setSavedData()
}

function generateTask(obj){

    // Criação dos elementos

    const li = document.createElement('li')
    const button = document.createElement('button')
    const div = document.createElement('div')
    const span = document.createElement('span')
    let button_div = document.createElement('div')
    const div_button1 = document.createElement('button')
    const div_button2 = document.createElement('button')
    const div_edit = document.createElement('div')
    const div_edit_input = document.createElement('input')
    const div_edit_div = document.createElement('div')
    const div_edit_div1 = document.createElement('div')
    const div_edit_div2 = document.createElement('div')

    // Atribuição de class

    li.className = 'tasks'
    button.className = 'button--default'
    div.className = 'button--options'
    span.className = 'description--task'
    button_div.classList.add('done')
    button_div.classList.add(obj.completed ? 'display_default' : 'vanish')
    div_button1.classList.add('button--default')
    div_button1.classList.add('edit')
    div_button2.classList.add('button--default')
    div_button2.classList.add('delete')
    div_edit.className = 'edit--task'
    div_edit_input.className = 'edit--save--task'
    div_edit_div.className = 'button--edit--options'
    div_edit_div1.classList.add('button--edit--default')
    div_edit_div1.classList.add('save')
    div_edit_div2.classList.add('button--edit--default')
    div_edit_div2.classList.add('cancel')

    // Atribuição de atributo de evento

    button_div.setAttribute('data-event', 'check')
    button.setAttribute('data-event', 'check')
    div_button1.setAttribute('data-event', 'edit')
    div_button2.setAttribute('data-event', 'delete')
    div_edit_div1.setAttribute('data-event', 'save')
    div_edit_div2.setAttribute('data-event', 'cancel')

    // Adicionando conteúdo

    span.textContent = obj.description

    // Estruturando elementos

    li.appendChild(button)
    li.appendChild(span)
    li.appendChild(div)
    button.appendChild(button_div)
    div.appendChild(div_button1)
    div.appendChild(div_button2)
    div_button1.appendChild(div_edit)
    div_edit.appendChild(div_edit_input)
    div_edit.appendChild(div_edit_div)
    div_edit_div.appendChild(div_edit_div1)
    div_edit_div.appendChild(div_edit_div2)

    return li

}

function renderTask(){

    taskList.innerHTML = ''
    taskStorage.forEach(function(e){
        taskList.appendChild(generateTask(e))
    })
    show()

}

function show(){

    if(taskStorage.length > 0){
        message.classList.add('vanish')
    } else{
        message.classList.remove('vanish')
    }

}

// Funções dentro da li

function activateFunction(e){

    const clickedFunction = e.target.getAttribute('data-event')
    
    if(!clickedFunction){
        return
    }

    let currentLi = e.target
    while(currentLi.nodeName !== 'LI'){

        currentLi = currentLi.parentElement

    }

    let currentLiIndex = Array.from(lis).indexOf(currentLi)

    const eventsInside = {

        check: function(){
            
            taskStorage[currentLiIndex].completed = !taskStorage[currentLiIndex].completed

            /* if(taskStorage[currentLiIndex].completed){
                currentLi.querySelector('.done').classList.remove('vanish')
            } else{
                currentLi.querySelector('.done').classList.add('vanish')
            } */ // ALTERANDO O DOM

            renderTask()
            setSavedData()

        },

        edit: function(){
            Array.from(taskList.querySelectorAll('.edit--task')).forEach(function(e){
                e.style.display = 'none'
            })
            currentLi.querySelector('.edit--task').style.display = 'flex'
            currentLi.querySelector('.edit--save--task').value = taskStorage[currentLiIndex].description
        },

        delete: function(){
            taskStorage.splice(currentLiIndex,(currentLiIndex+1)) // também é possivel usar splice
            renderTask()
            setSavedData()
        },

        save: function(){
            let val = currentLi.querySelector('.edit--save--task').value
            taskStorage[currentLiIndex].description = val
            renderTask()
            setSavedData()
        },

        cancel: function(){
            currentLi.querySelector('.edit--task').style.display = 'none'
        }

    }

    eventsInside[clickedFunction]()
    
}

taskList.addEventListener('click', activateFunction)