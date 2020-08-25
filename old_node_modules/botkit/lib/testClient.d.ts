/**
 * @module botkit
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity, ConversationState, Middleware, TestAdapter } from 'botbuilder-core';
import { DialogTurnResult } from 'botbuilder-dialogs';
import { Botkit } from './core';
/**
 * A client for testing dialogs in isolation.
 */
export declare class BotkitTestClient {
    private readonly _callback;
    private readonly _testAdapter;
    dialogTurnResult: DialogTurnResult;
    conversationState: ConversationState;
    /**
     * Create a BotkitTestClient to test a dialog without having to create a full-fledged adapter.
     *
     * ```javascript
     * let client = new BotkitTestClient('test', bot, MY_DIALOG, MY_OPTIONS);
     * let reply = await client.sendActivity('first message');
     * assert.strictEqual(reply.text, 'first reply', 'reply failed');
     * ```
     *
     * @param channelId The channelId to be used for the test.
     * Use 'emulator' or 'test' if you are uncertain of the channel you are targeting.
     * Otherwise, it is recommended that you use the id for the channel(s) your bot will be using and write a test case for each channel.
     * @param bot (Required) The Botkit bot that has the skill to test.
     * @param dialogToTest (Required) The identifier of the skill to test in the bot.
     * @param initialDialogOptions (Optional) additional argument(s) to pass to the dialog being started.
     * @param middlewares (Optional) a stack of middleware to be run when testing
     * @param conversationState (Optional) A ConversationState instance to use in the test client
     */
    constructor(channelId: string, bot: Botkit, dialogToTest: string | string[], initialDialogOptions?: any, middlewares?: Middleware[], conversationState?: ConversationState);
    constructor(testAdapter: TestAdapter, bot: Botkit, dialogToTest: string | string[], initialDialogOptions?: any, middlewares?: Middleware[], conversationState?: ConversationState);
    /**
     * Send an activity into the dialog.
     * @returns a TestFlow that can be used to assert replies etc
     * @param activity an activity potentially with text
     *
     * ```javascript
     * DialogTest.send('hello').assertReply('hello yourself').then(done);
     * ```
     */
    sendActivity(activity: Partial<Activity> | string): Promise<any>;
    /**
     * Get the next reply waiting to be delivered (if one exists)
     */
    getNextReply(): Partial<Activity>;
    private getDefaultCallback;
    private addUserMiddlewares;
}
