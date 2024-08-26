var guesses = 0;
var max_guesses = 6;

var word_typed = [];
var score = 0;

load_words("https://raw.githubusercontent.com/Ailer-h/wordle/main/valid-wordle-words.txt").then(words => {
    let word = words[Math.floor(Math.random() * words.length)]

    console.log(word)

    document.getElementById("body").addEventListener("keydown", (event) =>{

        if(!event.ctrlKey){
            if(event.key === "Enter"){
                if(word_typed.length == 5){

                    if(!words.includes(word_typed.join("").toLowerCase())){
                        notInWordList(); //Drops an warning on screen
                    
                    }else{
                        let won = submit_guess(word_typed, word.toUpperCase());

                        guesses++;
                        word_typed.length = 0;

                        if(won){
                            trigger_victory();
                        
                        }else if(guesses >= max_guesses){
                            trigger_loss(word);
                        }
                    }
                }
            
            }else if(event.code.includes("Key") && word_typed.length < 5){
                word_typed.push(event.key.toUpperCase());
    
                pass_letters(word_typed);
            
            }else if(event.key === "Backspace"){
                word_typed.pop();
    
                pass_letters(word_typed);
            
            }
        }
        
    });

    document.getElementById("play-again").addEventListener("click", function(){
        word = words[Math.floor(Math.random() * words.length)]
        console.log(word)

        guesses = 0;
        word_typed.length = 0;

        document.getElementById("go-warning").style.opacity = 0;

        clear_board();
        clear_keys();
    });

});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function notInWordList(){
    document.getElementById("wrong").style.opacity = 1;
    await timeout(500);
    document.getElementById("wrong").style.opacity = 0;
}

function clear_board(){
    Array.from(document.getElementsByTagName("div")).forEach(div =>{
        if(div.id.toLocaleLowerCase().includes("letter")){
            div.classList = "";
            div.textContent = "";
        }
    });
}

function clear_keys(){
    Array.from(document.getElementsByTagName("div")).forEach(div =>{
        if(div.id.toLocaleLowerCase().includes("key")){
            div.classList = "";
        }
    });
}

function changeMode(){

    let shuffle_on = document.getElementById("shuffle-on");
    let shuffle_off = document.getElementById("shuffle-off");
    let mode_label = document.getElementById("mode-label");

    if(shuffle_off.style.display == "block"){
        shuffle_off.style.display = "none";
        shuffle_on.style.display = "block";
        mode_label.textContent = "Random Word";

        return;
    }

    shuffle_off.style.display = "block";
    shuffle_on.style.display = "none";

    mode_label.textContent = "Word of the Day";

}

async function load_words(words_list){

    try{
        
        let response = await fetch(words_list);
        let data = await response.text();
        
        let words = data.split("\n").map(word => word.trim()).filter(word => word.length > 0);

        return words;

    }catch(error){
        console.error("Error fetching this file:", error);
        return null;
    }

}

function trigger_victory(){
    document.getElementById("go-warning").style.opacity = 1;
    document.getElementById("msg").textContent = "You Won!";
    document.getElementById("info").textContent = "Took you " + guesses + " guesses!"

    score += 10 - (guesses-1);
    document.getElementById("score").textContent = "Score: " + score;
}

function trigger_loss(word){
    document.getElementById("go-warning").style.opacity = 1;
    document.getElementById("msg").textContent = "You lost!";
    document.getElementById("info").textContent = "The word was: " + word;
}

function pass_letters(word_array){

    for(let i = 0; i < 5; i++){
        let letter = word_array.length >= i ? word_array[i] : "";
        let id = "letter_" + (guesses + 1) + "-" + (i + 1);

        document.getElementById(id).textContent = letter;

    }

}

function submit_guess(word_array, real_word){

    let right_letters = 0;

    for(let i = 0; i < 5; i++){
        let letter = word_array[i];
        let id = "letter_" + (guesses + 1) + "-" + (i + 1);

        document.getElementById(id).style.animationDelay = 100*i + "ms"
        document.getElementById(id).style.animation = "jump 300ms linear"
        
        if(letter == real_word.charAt(i)){
            document.getElementById(id).classList.add("letter-right-spot");
            document.getElementById("key_" + letter.toLowerCase()).classList.add("letter-right-spot");

            right_letters++;
        
        }else if(letter != real_word.charAt(i) && real_word.includes(letter)){
            document.getElementById(id).classList.add("letter-in-word");
            document.getElementById("key_" + letter.toLowerCase()).classList.add("letter-in-word");
        
        }

    }

    return right_letters == 5;

}