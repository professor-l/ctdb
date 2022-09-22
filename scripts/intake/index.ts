import { init } from "./orgList";
import { parseCSV } from "./sheetParser"

// Using global variables isn't best practice, but that's what I've done!
function main(){
    init();
    parseCSV();
    // TODO: learn how to format all this data for prisma
}

main();