
var app = {};
app.databases = ENV.generateData().toArray();

var load = function() {
    app.databases = ENV.generateData().toArray();
    RF.digest();
    Monitoring.renderRate.ping();
    setTimeout(load, ENV.timeout);
};
load();


RF.applyBindings('#app',{
    app: app
});
RF.run();




