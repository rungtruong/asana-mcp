// Override console log methods to prevent corrupting the JSON RPC stdout stream
console.log = console.error;
console.debug = console.error;
console.info = console.error;
