(function() {
  describe('cloudinary', function() {
    var cl, defaultConfig;
    defaultConfig = {
      cloud_name: 'demo'
    };
    cl = null;
    return describe("responsive", function() {
      var container, fixtureContainer, testDocument, testWindow, triggerResize;
      fixtureContainer = void 0;
      testDocument = null;
      container = void 0;
      testWindow = null;
      beforeAll(function(done) {
        testWindow = window.open("responsive-jquery-test.html", "Cloudinary test " + ((new Date()).toLocaleString()), "width=500, height=500");
        return testWindow.addEventListener('load', (function(_this) {
          return function() {
            var image1;
            testDocument = testWindow.document;
            image1 = testDocument.getElementById('image1');
            expect(image1.getAttribute('src')).toBeDefined();
            return done();
          };
        })(this), false);
      });
      afterAll(function() {
        return testWindow.close();
      });
      beforeEach(function() {
        cl = new cloudinary.Cloudinary({
          cloud_name: 'demo'
        });
        fixtureContainer = document.createElement('div');
        fixtureContainer.id = "fixture";
        return document.body.appendChild(fixtureContainer);
      });
      afterEach(function() {
        return fixtureContainer.remove();
      });
      triggerResize = function(window) {
        var evt;
        evt = window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        return window.dispatchEvent(evt);
      };
      it('should traverse up the DOM to find a parent that has clientWidth', function() {
        var aContainer, divContainer, img;
        aContainer = void 0;
        divContainer = void 0;
        img = void 0;
        divContainer = document.createElement('div');
        divContainer.style.width = 101;
        fixtureContainer.appendChild(divContainer);
        aContainer = document.createElement('a');
        divContainer.appendChild(aContainer);
        img = cl.image('sample.jpg', {
          width: 'auto',
          dpr: 'auto',
          crop: 'scale',
          responsive: true
        });
        aContainer.appendChild(img);
        cl.responsive();
        return expect(img.getAttribute('src')).not.toEqual(void 0);
      });
      it('should compute breakpoints correctly', function() {
        var el;
        el = document.createElement('img');
        fixtureContainer.appendChild(el);
        expect(cl.calc_breakpoint(el, 1)).toEqual(10);
        expect(cl.calc_breakpoint(el, 10)).toEqual(10);
        expect(cl.calc_breakpoint(el, 11)).toEqual(20);
        cl.config('breakpoints', [50, 150]);
        expect(cl.calc_breakpoint(el, 1)).toEqual(50);
        expect(cl.calc_breakpoint(el, 100)).toEqual(150);
        expect(cl.calc_breakpoint(el, 180)).toEqual(150);
        cl.config('breakpoints', function(width) {
          return width / 2;
        });
        expect(cl.calc_breakpoint(el, 100)).toEqual(50);
        el.setAttribute('data-breakpoints', '70,140');
        expect(cl.calc_breakpoint(el, 1)).toEqual(70);
        return expect(cl.calc_breakpoint(el, 100)).toEqual(140);
      });
      it('should correctly resize responsive images', function(done) {
        var dpr, img;
        container = void 0;
        img = void 0;
        dpr = cl.device_pixel_ratio();
        container = document.createElement('div');
        container.style.width = "101px";
        fixtureContainer.appendChild(container);
        img = cl.image('sample.jpg', {
          width: 'auto',
          dpr: 'auto',
          crop: 'scale',
          responsive: true
        });
        container.appendChild(img);
        expect(img.getAttribute('src')).toBeFalsy();
        cl.responsive();
        expect(img.getAttribute('src')).toEqual(window.location.protocol + '//res.cloudinary.com/demo/image/upload/c_scale,dpr_' + dpr + ',w_101/sample.jpg');
        container.style.width = "111px";
        expect(img.getAttribute('src')).toEqual(window.location.protocol + '//res.cloudinary.com/demo/image/upload/c_scale,dpr_' + dpr + ',w_101/sample.jpg');
        triggerResize(window);
        return window.setTimeout(function() {
          expect(img.getAttribute('src')).toEqual(window.location.protocol + '//res.cloudinary.com/demo/image/upload/c_scale,dpr_' + dpr + ',w_120/sample.jpg');
          container.style.width = "101px";
          return window.setTimeout(function() {
            expect(img.getAttribute('src')).toEqual(window.location.protocol + '//res.cloudinary.com/demo/image/upload/c_scale,dpr_' + dpr + ',w_120/sample.jpg');
            return done();
          }, 200);
        }, 200);
      });
      return it("should not resize images with fixed width containers", function(done) {
        var currentWidth, handler, image1, src;
        image1 = testDocument.getElementById('image1');
        src = image1.getAttribute('src');
        expect(src).toBeDefined();
        currentWidth = src.match(/w_(\d+)/)[1];
        handler = function() {
          var newWidth;
          src = image1.getAttribute('src');
          newWidth = src.match(/w_(\d+)/)[1];
          expect(newWidth).toEqual(currentWidth);
          testWindow.removeEventListener(handler);
          return done();
        };
        testWindow.addEventListener('resize', handler);
        return testWindow.resizeBy(200, 0);
      });
    });
  });

}).call(this);
