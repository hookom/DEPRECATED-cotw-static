describe('Find Page Tests - ', function() {
	it('should open social menu wheel', function() {
		browser.get('http://localhost:5555');

		// element(by.model('todoList.todoText')).sendKeys('write first protractor test');
		element(by.css('div.c-5')).click();
		browser.sleep(5000);
		// var todoList = element.all(by.repeater('todo in todoList.todos'));
		// expect(todoList.count()).toEqual(3);
		// expect(todoList.get(2).getText()).toEqual('write first protractor test');

		// todoList.get(2).element(by.css('input')).click();
		// var completedAmount = element.all(by.css('.done-true'));
		// expect(completedAmount.count()).toEqual(2);
	});
});