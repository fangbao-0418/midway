import { App, Init, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { context, Span, SpanKind, trace } from '@opentelemetry/api';
import { IMidwayApplication } from '@midwayjs/core';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TraceService {
  private currentTracerName: string;

  @App()
  protected app: IMidwayApplication;

  @Init()
  protected async init() {
    this.currentTracerName = this.app.getProjectName() ?? 'unknown_project';
  }

  private getCurrentSpan() {
    return trace.getSpan(context.active());
  }

  getTraceId() {
    return this.getCurrentSpan().spanContext().traceId;
  }

  createSpan(name: string, callback: (span: Span) => unknown) {
    return trace.getTracer(this.currentTracerName).startActiveSpan(
      name,
      {
        kind: SpanKind.CLIENT,
      },
      callback
    );
  }
}
