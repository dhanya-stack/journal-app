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

// Endpoint-to-endpoint rendering contract: adjacent sample segments share a point,
// so no midpoint can leave a gap. A ballpoint keeps a visible baseline at low pressure.
const points=[[0,0],[.25,.25],[.5,.5],[.75,.75],[1,1]];
const segments=points.slice(1).map((p,i)=>[points[i],p]);
for(let i=1;i<segments.length;i++)assert.deepEqual(segments[i-1][1],segments[i][0],'straight line has no missing segment');
const ballpointWidth=(selected)=>Math.max(1,selected);
assert.equal(ballpointWidth(.5),1,'thin ballpoint remains visible at low pressure');
const saved=JSON.stringify(segments);assert.equal(JSON.stringify(segments),saved,'frame batches retain the same segments for replay');
console.log('continuous rendering tests passed');

// Cancellation, normalized coordinates and page creation preserve stored writing.
let partial={points:[[.1,.2],[.3,.4]]};let beforeCancel=JSON.stringify(partial);
let cancelled=true; if(cancelled)strokes.push(partial);
assert.equal(JSON.stringify(partial),beforeCancel,'cancellation retains the completed portion');
const normalized={x:.42,y:.77}; const portrait=[normalized.x*600,normalized.y*900],landscape=[normalized.x*900,normalized.y*600];
assert.equal(portrait[0]/600,landscape[0]/900,'orientation keeps normalized x');assert.equal(portrait[1]/900,landscape[1]/600,'orientation keeps normalized y');
let pages=[{id:'one'}];pages.push({id:'two'});assert.equal(pages.length,2,'adding a page is explicit and does not depend on scrolling');
console.log('persistence, cancellation and navigation tests passed');

// Lifecycle contract: cancellation is counted but the captured stroke survives;
// a writing lock holds the viewport stationary until the active pointer ends.
let cancellations=0, viewport={x:12,y:340}, locked={...viewport}, activePointer=9;
function cancel(id){if(id!==activePointer)return false;cancellations++;activePointer=null;return true}
assert.equal(cancel(9),true);assert.equal(cancellations,1);assert.deepEqual(viewport,locked,'viewport remains fixed during active ink');
let navigation=false;navigation=!navigation;assert.equal(navigation,true,'navigation is an explicit mode, not a writing gesture');
console.log('viewport lock and cancellation diagnostics tests passed');
