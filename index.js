var guesses = 1;
var max_guesses = 5;

var word_typed = [];

var test = []

load_words(test, "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/6bfa15d263d6d5b63840a8e5b64e04b382fdb079/valid-wordle-words.txt").then(word => {
    console.log(word)
    
    document.getElementById("body").addEventListener("keydown", (event) =>{

        if(!event.ctrlKey){
            if(event.key === "Enter"){
                if(word_typed.length == 5){
                    if((word_typed.join("")))
                    submit_guess(word_typed, word.toUpperCase());
    
                    guesses++;
                    word_typed.length = 0;
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

});

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

        return words[Math.floor(Math.random() * words.length)];

    }catch(error){
        console.error("Error fetching this file:", error);
        return null;
    }

}

function pass_letters(word_array){

    for(let i = 0; i < 5; i++){
        let letter = word_array.length >= i ? word_array[i] : "";
        let id = "letter_" + guesses + "-" + (i + 1);

        document.getElementById(id).textContent = letter;

    }

}

function submit_guess(word_array, real_word){

    for(let i = 0; i < 5; i++){
        let letter = word_array[i];
        let id = "letter_" + guesses + "-" + (i + 1);
        
        if(letter == real_word.charAt(i)){
            document.getElementById(id).classList.add("letter-right-spot");
        
        }else if(letter != real_word.charAt(i) && real_word.includes(letter)){
            document.getElementById(id).classList.add("letter-in-word");
        }

        
    }

}