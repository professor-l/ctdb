import { init } from "./orgList";
import { parseCSV } from "./sheetParser";
import { input } from "./databaseInput";

// Using global variables isn't best practice, but that's what I've done!
function main(){
    init();
    parseCSV();
    input();
}

main();