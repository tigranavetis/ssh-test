const fs = require('fs');

function completer(line) {
  if (!line) {
    return [];
  }

  // This is a simulation of real autocomplete with hard coded prog list for Ubuntu.
  // Real autocomplete should work by folders and by real installed programs.
  // Also some prompts such as "Display all N possibilities? (y or n)" should be displayed.
  const completions = ('' + fs.readFileSync('./prog.txt')).split('\n');
  const hits = completions.filter((c) => c.startsWith(line));

  return [hits.length ? hits : completions, line];
}

module.exports = completer;
