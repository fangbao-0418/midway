import { ManagedResolverFactory } from '../../src/context/managedResolverFactory';
import { ObjectDefinition } from '../../src/definitions/objectDefinition';
import { MidwayContainer } from '../../src';

describe('/test/context/managedResolverFactory.test.ts', () => {
  it('create get deps should be ok', async () => {
    const context = new MidwayContainer();
    const resolver = new ManagedResolverFactory(context);

    const definition = new ObjectDefinition();
    definition.id = 'hello';
    definition.name = 'helloworld';
    definition.path = class HelloWorld {
      aa = 123;
      args?: any;
      constructor(args?: any) {
        this.args = args;
      }
    };

    definition.dependsOn.push('hello1');

    const definition1 = new ObjectDefinition();
    definition1.id = 'hello1';
    definition1.name = 'helloworld1';
    definition1.path = class HelloWorld1 {
      aa = 123;
      args?: any;
      constructor(args?: any) {
        this.args = args;
      }
    };

    context.registry.registerDefinition(definition.id, definition);
    context.registry.registerDefinition(definition1.id, definition1);

    let r = resolver.create({ definition, args: [[ 2, 3, 4 ]]});
    expect(r.aa).toEqual(123);
    expect(r.args).toStrictEqual([2, 3, 4]);

    await resolver.destroyCache();

    r = await resolver.createAsync({ definition, args: [[ 2, 3, 4 ]]});
    expect(r.aa).toEqual(123);
    expect(r.args).toStrictEqual([2, 3, 4]);

    await resolver.destroyCache();

    const callback = jest.fn();

    definition1.path = {
      returnNull() {
        callback('return null');
        return null;
      }
    };
    definition1.constructMethod = 'returnNull';

    try {
      await resolver.createAsync({ definition: definition1 });
    } catch (e) {
      callback(e.message);
    }

    expect(callback.mock.calls[0]).toEqual(['return null']);
    expect(callback.mock.calls[1]).toEqual(['hello1 construct return undefined']);
  });

  it('dfs should be ok', () => {
    const parent = new MidwayContainer();
    const context = new MidwayContainer(parent);
    const resolver = new ManagedResolverFactory(context);

    const definition = new ObjectDefinition();
    definition.id = 'hello';
    definition.name = 'helloworld';
    definition.path = class HelloWorld {
      aa = 123;
      args?: any;
      constructor(args?: any) {
        this.args = args;
      }
    };

    definition.dependsOn.push('hello1');

    const definition1 = new ObjectDefinition();
    definition1.id = 'hello1';
    definition1.name = 'helloworld1';
    definition1.path = class HelloWorld1 {
      aa = 123;
      args?: any;
      constructor(args?: any) {
        this.args = args;
      }
    };

    parent.registry.registerDefinition(definition.id, definition);
    parent.registry.registerDefinition(definition1.id, definition1);

    const subdef = new ObjectDefinition();
    subdef.id = 'test';
    subdef.properties.setProperty('hello1', 111);
    const r = resolver.depthFirstSearch('tt', subdef);
    expect(r).toBeFalsy();
  });
});
