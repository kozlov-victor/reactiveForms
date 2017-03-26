
var data = {};
data.databases = [];

var load = function() {
    data.databases = ENV.generateData().toArray();
    RF.digest();
    Monitoring.renderRate.ping();
    setTimeout(load, ENV.timeout);
};
load();


RF.applyBindings('#app',{
    data: data
});
RF.run();




