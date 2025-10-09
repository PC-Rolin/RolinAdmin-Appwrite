import { EVENT } from "$lib/constants";
import type { RemoteForm } from "@sveltejs/kit";
import { toast } from "svelte-sonner";

const forms = {
  close() {
    dispatchEvent(new CustomEvent(EVENT.CLOSE_FORM))
  },

  apply<T>(form: RemoteForm<any, T>, options?: {
    onSuccess?(result?: T): void
    onError?(): void
  }) {
    return form.enhance(async ({ submit }) => {
      try {
        await submit()
        options?.onSuccess?.(form.result)
        this.close()
      } catch (error) {
        if (options?.onError) {
          options.onError()
        } else {
          toast.error(String(error))
        }
      }
    })
  }
}

export default forms