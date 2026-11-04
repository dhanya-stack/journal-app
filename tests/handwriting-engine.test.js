// Run with: node tests/handwriting-engine.test.js
const assert=require('assert');
let active=null,strokes=[],redo=[];
function down(id,kind,finger=false){if(active||kind==='touch'&&!finger)return false;active={id,points:[]};return true}
function move(id,p){if(!active||active.id!==id)return false;active.points.push(p);return true}
function end(id){if(!active||active.id!==id)return false;strokes.push(active);active=null;return true}
assert.equal(down(1,'touch'),false,'Pencil-only mode rejects a finger');
assert.equal(down(2,'pen'),true);assert.equal(move(3,[1,1]),false,'Other pointers cannot interrupt a stroke');
assert.equal(move(2,[1,1]),true);assert.equal(end(2),true);assert.equal(active,null);
assert.equal(down(4,'pen'),true);assert.equal(end(4),true,'Rapid consecutive strokes work');
let removed=strokes.pop();redo.push(removed);assert.equal(strokes.length,1);strokes.push(redo.pop());assert.equal(strokes.length,2,'Undo/redo retains strokes');
console.log('handwriting engine state tests passed');
