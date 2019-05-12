'use strict';

const querystring = require('querystring');
const DOM = require(__dirname + '/create-js-dom.js');
const hiddenParametres = require(__dirname + '/hidden-parametres.json');

const querableParametres = groupName => querystring
.stringify(Object
  .assign(hiddenParametres, {
    ctl00$MainContent$ctl00$txtboxGroup: groupName
  })
  );
  
  const kpiRozkladURI =
  'http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx';

const rozklad = {};
  
rozklad.group = async group => {

  const groupRozklad = await new DOM(
    kpiRozkladURI,
    querableParametres(group)
  );

  // console.log([...groupRozklad.dom.getElementsByTagName('a')]);
  
  const incorrectGroup = groupRozklad
    .getByTag('span')
    .some(element => element.textContent === 'Групи з такою назвою не знайдено!');

  if (incorrectGroup) return 'Incorrect group';

  const [firstWeek, secondWeek] = [...groupRozklad.getByTag('tbody')]
    .map(week => [...week.childNodes].slice(1, 6))
    .map(week => week.map(pair => [...pair.childNodes].slice(2, 8)))
    .map(week => week.map(pair => pair.map(lesson => {

      const result = {};
      const child = [...lesson.childNodes];
      if (child[0]) {
        
        const title = child.filter(element => element.tagName === 'SPAN');
        if (title.length !== 1) {
          // TODO: FATAL
        }
        result.title = title[0].getElementsByTagName('a')[0].title;

        const links = child.filter(element => element.tagName === 'A');

        if (links[0] && links[links.length - 1].href.includes('maps.google')) {
          result.location = links[links.length - 1].textContent;
          result.locationLink = links[links.length - 1].href;
          links.splice(-1, 1);
        }
        console.log(links);
        result.teachers = [];
        links.forEach(link => {
          if (link.href.includes('Schedules')) {
            result.teachers.push({
              name: link.title,
              link: link.href
            });
          } else {
            // TODO: FATAL
          }
        });

      }
      return result;
    })))

  console.dir([firstWeek, secondWeek], { depth: null, showHidden: true });

  return [firstWeek, SecondWeek];

};

module.exports = rozklad;
